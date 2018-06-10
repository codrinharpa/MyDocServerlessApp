import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, Validators, FormBuilder, AbstractControl, ValidationErrors } from '@angular/forms';
import { PacientsService } from '../../service/pacients.service';
export class CreatePacientModel {
    firstname: string;
    surname:string;
    birthdate:Date;
    gender:string;
    email: string;
    phone: string;
}
@Component({
  selector: 'app-create-pacient',
  templateUrl: './create-pacient.component.html',
  styleUrls: ['./create-pacient.component.scss']
})
export class CreatePacientComponent implements OnInit {

    @Output() hideMe = new EventEmitter<any>();
    createPacientFormGroup:FormGroup;
    pacient:CreatePacientModel;
    public successMessage:string;
    public errorMessage:string;
    constructor(private formBuilder: FormBuilder, public pacientService:PacientsService) { 
        this.pacient = new CreatePacientModel();
        this.createPacientFormGroup = this.formBuilder.group({
            firstname: ['', Validators.required],
            surname: ['', Validators.required],
            phone: ['', [Validators.required,Validators.pattern('(0[0-9]{9})')]],
            birthdate: ['',Validators.required],
            email: ['', this.emailOrEmpty],
            gender: ['', Validators.required]
        });
    }
    get firstname() { return this.createPacientFormGroup.get('name'); }

    get surname() { return this.createPacientFormGroup.get('surname'); }

    get birthdate() { return this.createPacientFormGroup.get('birthdate');}

    get email() { return this.createPacientFormGroup.get('email'); }

    get phone() { return this.createPacientFormGroup.get('phone');}

    get gender() { return this.createPacientFormGroup.get('gender');}


    ngOnInit() {
    }

    onCreatePacient(){
        console.log("Creeam pacientul");
        this.pacientService.createPacient(this.pacient).subscribe( (data:any) =>{
            if(data.message == 'Created'){
                this.successMessage = "Pacientul a fost creeat cu succes";
            }
            else{
                this.errorMessage = "Eroare. Verificati campurile";
            }
        },(err:any)=>{
            console.log(err);
            this.errorMessage = "Eroare. Verificati campurile";
        });
    }

    onCloseClick(){
        this.errorMessage = null;
        this.successMessage = null;
        this.hideMe.emit('hide me');
    }
    emailOrEmpty(control: AbstractControl): ValidationErrors | null {
        if (control.value === '' || control.value === null || control.value === undefined)
            return null;
        else return Validators.email(control);
    }
}
