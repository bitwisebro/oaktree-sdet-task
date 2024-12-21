import { type Locator, type Page } from '@playwright/test';

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
    private readonly nextPageBtn: Locator = this.page.getByRole('button', { name: 'Next Page' });
    private readonly activityNameField: Locator = this.page.getByPlaceholder('Short Input');
    private readonly activityYrsField: Locator = this.page.getByPlaceholder('123');
    private readonly activityRecognitionsField: Locator = this.page.getByLabel('List any leadership roles,');
    private readonly activityDescriptionsField: Locator = this.page.getByLabel('Description of Involvement *');
    private readonly activityAddBtn: Locator = this.page.getByRole('button', { name: 'Add', exact: true });



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
}