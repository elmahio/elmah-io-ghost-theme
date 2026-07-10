CookieConsent.run({
    cookie: {
        name: 'cc_cookie',
        domain: window.location.hostname.includes('elmah.io') ? '.elmah.io' : window.location.hostname,
        path: '/',
        sameSite: 'Lax',
        expiresAfterDays: 365
    },
    guiOptions: {
        consentModal: {
            layout: 'box wide',
            position: 'middle center',
            flipButtons: true
        }
    },
    categories: {
        necessary: { enabled: true, readOnly: true },
        preferences: { enabled: false }
    },
    manageScriptTags: true,
    language: {
        default: 'en',
        translations: {
            en: {
                consentModal: {
                    title: 'This website uses cookies',
                    description: 'We use cookies to ensure our platform is secure and works correctly. This includes essential tools for bot protection (Cloudflare), secure payments (Stripe), and CSRF protection. With your permission, we also use optional cookies to power our support chat (Intercom) and remember your UI preferences. We do not sell your data or use advertising tracking cookies.',
                    acceptAllBtn: 'Allow all',
                    acceptNecessaryBtn: 'Deny',
                    showPreferencesBtn: 'Manage preferences'
                },
                preferencesModal: {
                    title: 'Cookie Preferences Center',
                    savePreferencesBtn: 'Accept current selection',
                    sections: [
                        { 
                            title: 'Necessary <span class="pm__badge">Always On</span>',
                            description: 'Necessary cookies help make a website usable by enabling basic functions like page navigation and access to secure areas of the website. The website cannot function properly without these cookies.',
                            linkedCategory: 'necessary',
                            cookieTable: {
                                headers: {
                                    name: 'Name',
                                    domain: 'Domain',
                                    description: 'Description',
                                    expiration: 'Storage duration'
                                },
                                body: [
                                    {
                                        name: 'cf.turnstile.u',
                                        domain: 'cloudflare',
                                        description: 'This cookie is used to help distinguish between human users and bots when using Cloudflare Turnstile.',
                                        expiration: 'Persistent'
                                    },
                                    {
                                        name: 'cc_cookie',
                                        domain: `
                                            <span class="d-block">elmah.io</span>
                                            <span class="d-block">app.elmah.io</span>
                                            <span class="d-block">docs.elmah.io</span>
                                            <span class="d-block">blog.elmah.io</span>
                                        `,
                                        description: 'Stores the user\'s cookie consent state for the current domain.',
                                        expiration: '1 year'
                                    },
                                    {
                                        name: '.AspNetCore.Antiforgery.#',
                                        domain: `
                                            <span class="d-block">elmah.io</span>
                                            <span class="d-block">app.elmah.io</span>
                                        `,
                                        description: 'Helps prevent Cross-Site Request Forgery (CSRF) attacks.',
                                        expiration: 'Session'
                                    },
                                    {
                                        name: '.AspNetCore.Cookies',
                                        domain: 'app.elmah.io',
                                        description: 'Authentication cookie used by ASP.NET Core.',
                                        expiration: '1 hour'
                                    },
                                    {
                                        name: '__cf_bm',
                                        domain: 'i.sstatic.net',
                                        description: 'This cookie is used to distinguish between humans and bots. This is beneficial for the website, in order to make valid reports on the use of their website.',
                                        expiration: '1 day'
                                    },
                                    {
                                        name: '__cflb',
                                        domain: 'i.sstatic.net',
                                        description: 'Registers which server-cluster is serving the visitor. This is used in context with load balancing, in order to optimize user experience.',
                                        expiration: '1 day'
                                    },
                                    {
                                        name: '_cfuvid',
                                        domain: 'i.sstatic.net',
                                        description: 'This cookie is a part of the services provided by Cloudflare - Including load-balancing, deliverance of website content and serving DNS connection for website operators.',
                                        expiration: 'Session'
                                    },
                                    {
                                        name: '__stripe_mid',
                                        domain: 'stripe',
                                        description: 'A cookie used by Stripe to enable payments.',
                                        expiration: '1 year'
                                    },
                                    {
                                        name: '__stripe_sid',
                                        domain: 'stripe',
                                        description: 'A cookie used by Stripe to enable payments.',
                                        expiration: '1 day'
                                    }
                                ]
                            }
                        },
                        {
                            title: 'Preferences',
                            description: 'Preference cookies enable a website to remember information that changes the way the website behaves or looks, like your preferred language or the region that you are in.',
                            linkedCategory: 'preferences',
                            cookieTable: {
                                headers: {
                                    name: 'Name',
                                    domain: 'Domain',
                                    description: 'Description',
                                    expiration: 'Storage duration'
                                },
                                body: [
                                    {
                                        name: 'exitIntentShown',
                                        domain: 'elmah.io',
                                        description: 'Used to persist when the user closes the exit intent popup.',
                                        expiration: 'Persistent'
                                    },
                                    {
                                        name: 'PopupSignupShow',
                                        domain: 'elmah.io',
                                        description: 'Used to persist when the user closes the newsletter popup.',
                                        expiration: 'Persistent'
                                    },
                                    {
                                        name: 'NPS_#_throttle',
                                        domain: 'elmah.io',
                                        description: 'Cookie used to show the NPS widget within the app.',
                                        expiration: '12 hours'
                                    },
                                    {
                                        name: 'intercom-device-id-#',
                                        domain: 'intercom',
                                        description: 'A cookie used by Intercom to show the Messenger.',
                                        expiration: '270 days'
                                    },
                                    {
                                        name: 'intercom-id-#',
                                        domain: 'intercom',
                                        description: 'A cookie used by Intercom to show the Messenger.',
                                        expiration: '270 days'
                                    },
                                    {
                                        name: 'intercom-session-#',
                                        domain: 'intercom',
                                        description: 'A cookie used by Intercom to show the Messenger.',
                                        expiration: '7 days'
                                    }
                                ]
                            }
                        },
                        {
                            title: 'Cross-domain consent',
                            description: `Your consent applies to the following domains:
                                <ul class="list-unstyled mb-0 mt-2">
                                    <li><a href="https://elmah.io/">elmah.io</a></li>
                                    <li><a href="https://app.elmah.io/">app.elmah.io</a></li>
                                    <li><a href="https://docs.elmah.io/">docs.elmah.io</a></li>
                                    <li><a href="https://blog.elmah.io/">blog.elmah.io</a></li>
                                </ul>
                            `
                        },
                        {
                            title: 'About',
                            description: `
                                <ul class="list-unstyled mb-0">
                                    <li class="mb-1">To help our websites function efficiently, we use small text files known as cookies. While the law allows us to store cookies on your device if they are essential for the site's operation, we require your explicit permission for all other types. This site uses various cookie categories, including those from third-party services integrated into our pages.</li>
                                    <li class="mb-1">You have full control over your data. You can modify or withdraw your consent at any time by clicking the <strong>Cookie Consent</strong> link.</li>
                                    <li>For a deeper look at how we handle your personal data and how to get in touch with our team, please review our <a href="https://elmah.io/legal/cookie-policy/" target="_blank">Cookie Policy</a> and <a href="https://elmah.io/legal/privacy-policy/" target="_blank">Privacy Policy</a>.</li>
                                </ul>
                            `
                        },
                    ]
                }
            }
        }
    }
});