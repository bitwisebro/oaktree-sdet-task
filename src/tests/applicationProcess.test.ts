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

    const application = new ApplicationPage(page);
    await test.step("Register a new User", async () => {
        await page.goto('/login');
        const registerPage = new RegisterPage(page);
        await registerPage.enterEmailAndClickNext(userEmail);
        await registerPage.enterDetailsAndClickNext(userFirstName, userLastName, userPhone, userPassword);

        await page.waitForURL("https://apply.mykaleidoscope.com/applicant/applications", { waitUntil: 'domcontentloaded', timeout: 30000 });
        const popup = page.getByRole('heading', { name: `Welcome back, ${userFirstName}!` })
        await expect(popup).toBeVisible();
    })

    await test.step("Page 1: Lets get to know you!", async () => {
        await page.goto("/program/sdet-test-scholarship");

        // Begin a new Application
        await application.beginBtn.waitFor({ state: 'visible', timeout: 30000 });
        await application.beginBtn.click();
        application.getToKnowYouTitle.waitFor({ state: 'visible', timeout: 25000 });

        // Fill out all Required Fields
        await application.fillGetToKnowYouFormAndNext("Test Street", "Colorado", "Test City", "12345", "India");
    })

    await test.step("Page 2: Validate & Finish Activities Page", async () => {
        // Validate that at least 2 Extracurricular Activities are required, when not providing enough.
        await application.clickNextBtn();
        await expect.soft(page.getByText('Please add at least 2 entries')).toBeVisible();

        // Finish page by providing 4 Activities
        const activities = [
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
        await application.enterHighSchoolInformation("Test School", "Random Address", "Some City", "Colorado", "12345", "9", "2023");

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
        const selectOptionAndAddData = [
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
});