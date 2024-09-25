import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../../services/user/user/user.service';
import { GeneralService } from '../../../services/general/general.service';

@Component({
  selector: 'app-user-profil',
  templateUrl: './user-profil.component.html',
  styleUrls: ['./user-profil.component.css'],
})
export class UserProfilComponent implements OnInit {
  public loading: boolean = true;
  public showForm: boolean = false;
  public user_information: any | null = null;
  public environment = environment;
  public formUserProfil!: FormGroup;
  public dataTemp: any = [];

  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private generalService: GeneralService
  ) {}

  async ngOnInit() {
    this.createForm();
    const storedUserInfo = localStorage.getItem('user_information');
    this.user_information = storedUserInfo
      ? JSON.parse(storedUserInfo).data
      : null;
    console.log(this.user_information);

    await this.setDataForm();
  }

  public createForm() {
    this.formUserProfil = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      username: [{ value: '', disabled: true }],
      email: [{ value: '', disabled: true }],
      password: ['', Validators.required],
      image_profile: [{ value: '', disabled: true }],
    });
  }

  async setDataForm(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.formUserProfil.controls['name'].setValue(
          this.user_information.name
        );
        this.formUserProfil.controls['email'].setValue(
          this.user_information.email
        );
        this.formUserProfil.controls['image_profile'].setValue(
          this.user_information.image_profile
        );
        this.formUserProfil.controls['username'].setValue(
          this.user_information.username
        );

        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }

  getValidationClass(controlName: string): { [key: string]: any } {
    const control = this.formUserProfil.get(controlName);
    return {
      'is-invalid': control?.invalid && (control?.touched || control?.dirty),
      'is-valid': control?.valid && (control?.touched || control?.dirty),
    };
  }
}
