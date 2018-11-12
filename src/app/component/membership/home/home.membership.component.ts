import { Component, OnInit, Input, OnChanges, NgZone } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatSnackBar, MatDialogRef, MatDialog } from '@angular/material';

import { User } from '../../../model/user';
import { UserService } from '../../../service/user.service';
import { SignUpDialogComponent } from '../signup-dialog/signup-dialog.membership.component';

@Component({
    selector: 'app-membership-home',
    templateUrl: './home.membership.component.html',
    styleUrls: ['./home.membership.component.scss'],
    providers: [UserService, MatSnackBar]
})
export class HomeMembershipComponent implements OnInit {
    newUser: User = new User();

    pseudo: FormControl;
    password: FormControl;
    form: FormGroup;

    dialogRef: MatDialogRef<SignUpDialogComponent>;
    screenHeight: number;

    isLoading = false;

    constructor(public signupDialog: MatDialog, private ngZone: NgZone, public snackBar: MatSnackBar, private fb: FormBuilder, private userService: UserService, private router: Router, private metaService: Meta, private titleService: Title) {
        this.titleService.setTitle('Itineraris - Connexion');
        this.metaService.updateTag({ content: 'Itineraris - Connexion' }, 'property="og:title"');
        this.metaService.updateTag({ content: 'Connectez-vous à votre compte et créez vos itinéraires de voyages' }, 'name="description"');
        this.metaService.updateTag({ content: 'Connectez-vous à votre compte et créez vos itinéraires de voyages' }, 'property="og:description"');

        this.pseudo = new FormControl('', [Validators.required, Validators.minLength(3)]);
        this.password = new FormControl('', [Validators.required, Validators.minLength(3)]);

        this.form = this.fb.group({
            pseudo: this.pseudo,
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

    signin() {
        if (this.form.dirty && this.form.valid) {
            this.userService
                .signin(this.newUser.email, this.newUser.password)
                .subscribe(
                    result => result != null
                        ? this.successfullySignedIn(result)
                        : alert('Désolé mais aucun compte n\'existe avec les identifiants suivants'),
                    error => alert(error)
                );
        }
    }

    successfullySignedIn(user: User) {
        this.userService.setCurrentUser(user);
        this.router.navigate(['compte/tableau-de-bord.html']);
        return false;
    }

    openDialog() {
        this.dialogRef = this.signupDialog.open(SignUpDialogComponent, {
            disableClose: false,
        });

        const that = this;
        return this.dialogRef.afterClosed().subscribe(function () {
            // TODO snackbar
        });
    }
}
