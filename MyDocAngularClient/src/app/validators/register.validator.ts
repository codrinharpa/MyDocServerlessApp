import { FormGroup } from '@angular/forms';

export class RegistrationValidator {
    static validate(registrationFormGroup: FormGroup) {
        let password = registrationFormGroup.controls.password.value;
        let passwordConfirmation = registrationFormGroup.controls.passwordConfirmation.value;

        if (passwordConfirmation.length <= 0) {
            return null;
        }

        if (passwordConfirmation !== password) {
            return {
                doesMatchPassword: true
            };
        }

        return null;

    }
}