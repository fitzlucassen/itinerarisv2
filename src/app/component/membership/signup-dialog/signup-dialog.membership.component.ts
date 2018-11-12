import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { MatSnackBar, MatDialogRef } from '@angular/material';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

import { User } from '../../../model/user';
import { UserService } from '../../../service/user.service';

@Component({
    selector: 'app-membership-signup',
    templateUrl: './signup-dialog.membership.component.html',
    styleUrls: ['./signup-dialog.membership.component.scss'],
    providers: [UserService, MatSnackBar]
})
export class SignUpDialogComponent implements OnInit {
    newUser: User = new User();
    isLoading = false;

    name: FormControl;
    email: FormControl;
    password: FormControl;
    form: FormGroup;

    screenHeight: number;

    constructor(private dialogRef: MatDialogRef<SignUpDialogComponent>, private ngZone: NgZone, public snackBar: MatSnackBar, private fb: FormBuilder, private userService: UserService, private router: Router, private metaService: Meta, private titleService: Title) {
        this.titleService.setTitle('Itineraris - Inscription');
        this.metaService.updateTag({ content: 'Itineraris - Inscription' }, 'property="og:title"');
        this.metaService.updateTag({ content: 'Inscrivez-vous afin de créer vos itinéraires de voyages' }, 'name="description"');
        this.metaService.updateTag({ content: 'Inscrivez-vous afin de créer vos itinéraires de voyages' }, 'property="og:description"');

        this.name = new FormControl('', [Validators.required, Validators.minLength(3)]);
        this.email = new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}')]);
        this.password = new FormControl('', [Validators.required, Validators.minLength(3)]);

        this.form = this.fb.group({
            name: this.name,
            email: this.email,
            password: this.password,
        });

        this.screenHeight = document.getElementsByTagName('body')[0].clientHeight - 64;
        window.onresize = (e) => {
            // ngZone.run will help to run change detection
            this.ngZone.run(() => {
                this.screenHeight = document.getElementsByTagName('body')[0].clientHeight - 64;
            });
        };
    }

    ngOnInit() {
    }

    signup($event) {
        if (this.form.dirty && this.form.valid) {
            this.isLoading = true;
            this.userService
                .signup(this.newUser)
                .subscribe(
                    id => id != null ? this.successfullySignedup() : function () { },
                    error => alert(error)
                );
        }
        return false;
    }

    private successfullySignedup() {
        this.isLoading = false;
        this.snackBar.open('Félicitation votre compte a bien été créé', 'Ok', {
            duration: 3000
        });
        this.dialogRef.close();
    }
}
