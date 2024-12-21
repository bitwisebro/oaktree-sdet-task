import { fi } from '@faker-js/faker/.';
import { expect, type Locator, type Page } from '@playwright/test';

export default class RegisterPage {
    constructor(readonly page: Page) { }
    private readonly emailField:Locator = this.page.getByPlaceholder('Email Address');
    private readonly nextBtn:Locator = this.page.getByLabel('Next');
    private readonly firstNameField:Locator = this.page.getByLabel('First Name');
    private readonly lastNameField:Locator = this.page.getByLabel('Last Name');
    private readonly mobileNumberField:Locator = this.page.locator("input[type='tel']");
    private readonly passwordField:Locator = this.page.getByLabel('Create a Password');
    private readonly submitBtn:Locator = this.page.getByLabel('Submit');
    private readonly ageCriteriaCheckBox:Locator = this.page.getByLabel('I confirm that I am at least');


    async enterEmailAndClickNext(applicantEmail:string){
        await this.emailField.fill(applicantEmail);
        await this.nextBtn.click();
    }

    async enterDetailsAndClickNext(firstName:string, lastName:string,mobileNumber:string, password:string){
        await this.firstNameField.fill(firstName);
        await this.lastNameField.fill(lastName);
        await this.passwordField.fill(password);
        await this.mobileNumberField.fill(mobileNumber);
        await this.checkAgeCriteria()
        await this.submitBtn.click();
    }

    async checkAgeCriteria(){
        await this.ageCriteriaCheckBox.check();
    }
}