import { expect, type Locator, type Page } from '@playwright/test';
import { join } from 'path';

export default class ApplicationPage {
    constructor(readonly page: Page) { }

    public readonly beginBtn: Locator = this.page.getByRole('link', { name: 'Begin' });
    public readonly getToKnowYouTitle: Locator = this.page.locator("//*[text()='Lets get to know you!']");
    public readonly addEntryBtn: Locator = this.page.getByRole('button', { name: 'Add Entry', exact: true });

    private readonly streetAddressField: Locator = this.page.getByPlaceholder('Enter your street address');
    private readonly stateField: Locator = this.page.getByPlaceholder('Enter your state');
    private readonly cityField: Locator = this.page.getByPlaceholder('Enter your city');
    private readonly zipcodeField: Locator = this.page.getByPlaceholder('Enter your zip code');
    private readonly countryField: Locator = this.page.getByPlaceholder('Enter your country');
    private readonly nextPageBtn: Locator = this.page.getByRole('button', { name: 'Next Page', exact: true });
    private readonly activityNameField: Locator = this.page.getByPlaceholder('Short Input');
    private readonly activityYrsField: Locator = this.page.getByPlaceholder('123');
    private readonly activityRecognitionsField: Locator = this.page.getByLabel('List any leadership roles,');
    private readonly activityDescriptionsField: Locator = this.page.getByLabel('Description of Involvement *');
    private readonly activityAddBtn: Locator = this.page.getByRole('button', { name: 'Add', exact: true });
    private readonly schoolNameField: Locator = this.page.getByPlaceholder('Please enter the name of your');
    private readonly schoolAddressField: Locator = this.page.getByPlaceholder('Enter high school street');
    private readonly schoolCityField: Locator = this.page.getByPlaceholder('Enter high school city');
    private readonly schoolStateField: Locator = this.page.getByPlaceholder('Enter high school state');
    private readonly schoolZipcodeField: Locator = this.page.getByPlaceholder('e.g. 55413');
    private readonly schoolGpaField: Locator = this.page.getByPlaceholder('Enter your current GPA');
    private readonly schoolGraduationField: Locator = this.page.getByPlaceholder('Enter a date');
    private readonly schoolTranscriptField: Locator = this.page.getByRole('button', { name: 'Upload File' });

    async fillGetToKnowYouFormAndNext(streetAddress: string, state: string, city: string, zipcode: string, country: string) {
        await this.streetAddressField.fill(streetAddress);
        await this.stateField.fill(state);
        await this.page.getByRole('option', { name: state }).click();
        await this.cityField.fill(city);
        await this.zipcodeField.fill(zipcode);
        await this.countryField.fill(country);
        await this.page.getByRole('option', { name: country }).click();
        await this.clickNextBtn();
    }

    async clickNextBtn() {
        await this.page.waitForTimeout(5000);
        await this.nextPageBtn.click();
    }

    async addActivity(activityName: string, yrs: string, recognitions: string, description: string) {
        await this.addEntryBtn.click();
        await this.activityNameField.fill(activityName);
        await this.activityYrsField.fill(yrs);
        await this.activityRecognitionsField.fill(recognitions);
        await this.activityDescriptionsField.fill(description);
        await this.activityAddBtn.click();
    }

    async enterHighSchoolInformation(schoolName: string, schoolAddress: string, schoolCity: string, schoolState: string, schoolZip: string, gpa: string, graduationYear: string) {
        await this.schoolNameField.fill(schoolName);
        await this.schoolAddressField.fill(schoolAddress);
        await this.schoolCityField.fill(schoolCity);
        await this.schoolStateField.fill(schoolState);
        await this.page.getByRole('option', { name: schoolState }).click();
        await this.schoolZipcodeField.fill(schoolZip);
        await this.schoolGpaField.fill(gpa);
        await this.schoolGraduationField.fill(graduationYear);
    }

    async uploadTranscript() {
        const fileChooserPromise = this.page.waitForEvent('filechooser');
        await this.schoolTranscriptField.click();
        const fileChooser = await fileChooserPromise;
        await fileChooser.setFiles(join(__dirname, 'My School Transcript.pdf'));
        await expect(this.page.getByRole('button', { name: 'My School Transcript.pdf' })).toBeVisible({ timeout: 120000 });
    }
}