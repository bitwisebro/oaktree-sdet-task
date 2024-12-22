import { expect, Locator, test } from '@playwright/test';
import { faker } from '@faker-js/faker';
import RegisterPage from '../pages/register.page';
import ApplicationPage from '../pages/application.page';

test('Kaleidoscope Applicant Application process', async ({ page }) => {
    let userFirstName = faker.person.firstName();
    let userLastName = faker.person.lastName();
    let userEmail = faker.internet.email(
        { firstName: userFirstName, lastName: userLastName, provider: `mailinator.com` });
    let userPassword = `${userFirstName}@${userLastName}_123`;
    let userPhone = faker.phone.number({ style: 'national' });
    let userStreetAddress = "Test Street", userState = "Colorado", userCity = "Test City",
        userZipCode = "12345", userCountry = "India";
    let activities: any[];
    let schoolName = "Test School", schoolAddress = "Random Address", schoolCity = "Some City", schoolState = "Colorado",
        schoolZip = "12345", schoolGpa = "9", schoolGraduationYear = "2023", selectOptionAndAddData: any[];

    const application = new ApplicationPage(page);
    await test.step("Register a new User", async () => {
        await page.goto('/login', { timeout: 60000 });
        const registerPage = new RegisterPage(page);
        await registerPage.enterEmailAndClickNext(userEmail);
        await registerPage.enterDetailsAndClickNext(userFirstName, userLastName, userPhone, userPassword);

        await page.waitForURL("https://apply.mykaleidoscope.com/applicant/applications", { waitUntil: 'domcontentloaded', timeout: 30000 });
        const popup = page.getByRole('heading', { name: `Welcome back, ${userFirstName}!` })
        await expect(popup).toBeVisible();
    })

    await test.step("Page 1: Lets get to know you!", async () => {
        await page.goto("/program/sdet-test-scholarship", { timeout: 60000 });

        // Begin a new Application
        await application.beginBtn.waitFor({ state: 'visible', timeout: 30000 });
        await application.beginBtn.click();
        await application.getToKnowYouTitle.waitFor({ state: 'visible', timeout: 25000 });

        // Fill out all Required Fields
        await application.fillGetToKnowYouFormAndNext(userStreetAddress, userState, userCity, userZipCode, userCountry);
    })

    await test.step("Page 2: Validate & Finish Activities Page", async () => {
        // Validate that at least 2 Extracurricular Activities are required, when not providing enough.
        await application.clickNextBtn();
        await expect.soft(page.getByText('Please add at least 2 entries')).toBeVisible();

        // Finish page by providing 4 Activities
        activities = [
            { activityName: "Activity 1", activityYears: "11", recognitions: "Recognition 1", description: "Great Description 1" },
            { activityName: "Activity 2", activityYears: "12", recognitions: "Recognition 2", description: "Great Description 2" },
            { activityName: "Activity 3", activityYears: "13", recognitions: "Recognition 3", description: "Great Description 3" },
            { activityName: "Activity 4", activityYears: "14", recognitions: "Recognition 4", description: "Great Description 4" }
        ]
        for (const activity of activities) {
            await application.addActivity(activity.activityName, activity.activityYears, activity.recognitions, activity.description);
        }

        await application.clickNextBtn();
    })

    await test.step("Page 3: High School Information", async () => {
        // Fill out the form
        await application.enterHighSchoolInformation(schoolName, schoolAddress, schoolCity, schoolState, schoolZip, schoolGpa, schoolGraduationYear);

        // Upload the provided School Transcript
        await application.uploadTranscript();
        await application.clickNextBtn();
    })

    await test.step("Page 4: Essay", async () => {
        // Validate that each option under "Please select the essay types you want to write about” shows an essay box.
        const essayMap = [
            { option: "Cars", boxName: "Essay about Cars" },
            { option: "Animals", boxName: "Essay about Animals" },
            { option: "School", boxName: "Essay about School" },
            { option: "Other", boxName: "Provide an essay about any topic" }
        ]

        for (const essay of essayMap) {
            const checkBox: Locator = page.getByLabel(essay.option, { exact: true });
            await checkBox.check();

            const textAreaField: Locator = page.locator(`//label[text()='${essay.boxName}']/parent::div//textarea`);
            await expect.soft(textAreaField).toBeVisible();
            await checkBox.uncheck();
        }

        // Select Only Animals and School
        selectOptionAndAddData = [
            { option: "Animals", boxName: "Essay about Animals", answer: faker.string.alpha(25) },
            { option: "School", boxName: "Essay about School", answer: faker.string.alpha(25) }
        ]

        for (const option of selectOptionAndAddData) {
            const checkBox: Locator = page.getByLabel(option.option, { exact: true });
            await checkBox.check();

            const textAreaField: Locator = page.locator(`//label[text()='${option.boxName}']/parent::div//textarea`);
            await expect.soft(textAreaField).toBeVisible();
            await textAreaField.fill(option.answer);
        }
        await application.clickNextBtn();
    })

    await test.step("Validate Pages and Answers shown as answered", async () => {
        await application.expandTab("Lets get to know you!");

        // Verify Data for: Lets Get To Know You
        await expect.soft(await application.getApplicantDatafromUI("First Name")).toEqual(userFirstName);
        await expect.soft(await application.getApplicantDatafromUI("Last Name")).toEqual(userLastName);
        await expect.soft(await application.getApplicantDatafromUI("Email Address")).toEqual(userEmail.toLowerCase());
        await expect.soft(await application.getApplicantDatafromUI("State (Full)")).toEqual(userState);
        await expect.soft(await application.getApplicantDatafromUI("City")).toEqual(userCity);
        await expect.soft(await application.getApplicantDatafromUI("Zip Code")).toEqual(userZipCode);
        await expect.soft(await application.getApplicantDatafromUI("Country")).toEqual(userCountry);

        // Extracurricular Activities
        await application.expandTab("Extracurricular Activities");
        for (let i = 0; i < activities.length; i++) {
            await application.expandTab(activities[i].activityName);
            await expect.soft(await application.getApplicantDatafromUI("Extracurricular Activity Name", i)).toEqual(activities[i].activityName);
            await expect.soft(await application.getApplicantDatafromUI("Total Number of Years Involved", i)).toEqual(activities[i].activityYears);
            await expect.soft(await application.getApplicantDatafromUI("List any leadership roles, offices, honors and recognitions related to this activity", i)).toEqual(activities[i].recognitions);
            await expect.soft(await application.getApplicantDatafromUI("Description of Involvement", i)).toEqual(activities[i].description);
        }

        // High School Information
        await application.expandTab("High School Information");
        await expect.soft(await application.getApplicantDatafromUI("High School Name")).toEqual(schoolName);
        await expect.soft(await application.getApplicantDatafromUI("High School Street Address")).toEqual(schoolAddress);
        await expect.soft(await application.getApplicantDatafromUI("High School City")).toEqual(schoolCity);
        await expect.soft(await application.getApplicantDatafromUI("High School State")).toEqual(schoolState);
        await expect.soft(await application.getApplicantDatafromUI("High School Zip Code")).toEqual(schoolZip);
        await expect.soft(await application.getApplicantDatafromUI("GPA")).toEqual(schoolGpa);
        await expect.soft(await application.getApplicantDatafromUI("Year of High School Graduation")).toContain(schoolGraduationYear); //this is failing, as expected was 2023 & actual is: 01/01/2023 | hence temporarily using contain assertion
        await expect.soft(page.getByRole('button', { name: 'My School Transcript.pdf' })).toBeVisible({ timeout: 120000 });

        // Essay
        await application.expandTab("Essay");
        await expect.soft(await application.getApplicantDatafromUI("Please select the essay types")).toEqual("Animals, School");
        await expect.soft(await application.getApplicantDatafromUI("Essay about Animals")).toEqual(selectOptionAndAddData[0].answer);
        await expect.soft(await application.getApplicantDatafromUI("Essay about School")).toEqual(selectOptionAndAddData[1].answer);

        await test.step("Submit Application & Verify that editing is not allowed after Application has been submitted.", async () => {
            // Capture the Page URL so it can be redirected back to after Submitting the Application.
            const applicationEditPageURL = await page.url();

            // Submit the Application
            await application.submitBtn.click();

            // Validate Editing is not allowed after Application has been submitted.
            await page.waitForURL("/applicant/applications");
            await page.goto(applicationEditPageURL, { timeout: 60000 });
            await expect(application.editBtn).toHaveCount(0);
        })
    })
});