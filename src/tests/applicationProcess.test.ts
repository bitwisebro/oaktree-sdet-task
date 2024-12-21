import { expect, test } from '@playwright/test';
import { faker } from '@faker-js/faker';
import RegisterPage from '../pages/register.page';

test('Kaleidoscope Applicant Application process', async ({ page }) => {
    let userFirstName = faker.person.firstName();
    let userLastName = faker.person.lastName();
    let userEmail = faker.internet.email(
        { firstName: userFirstName, lastName: userLastName, provider: `mailinator.com` });
    let userPassword = `${userFirstName}@${userLastName}_123`;
    let userPhone = faker.phone.number({ style: 'national' });

    await test.step("Register a new User", async () => {
        await page.goto('/login', { timeout: 20000 });
        const registerPage = new RegisterPage(page);
        await registerPage.enterEmailAndClickNext(userEmail);
        await registerPage.enterDetailsAndClickNext(userFirstName, userLastName, userPhone, userPassword);

        await page.waitForURL("https://apply.mykaleidoscope.com/applicant/applications", { waitUntil: 'networkidle' });
        const popup = page.getByRole('heading', { name: `Welcome back, ${userFirstName}!` })
        await expect(popup).toBeVisible();
    })
});