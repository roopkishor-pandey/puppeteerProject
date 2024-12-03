"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const puppeteer = __importStar(require("puppeteer"));
class MyClass {
    async login(page) {
        await page.setViewport({ width: 1366, height: 768 });
        await page.goto('https://www.amazon.in/ap/signin?openid.pape.max_auth_age=0&openid.return_to=https%3A%2F%2Fwww.amazon.in%2Flog-in%2Fs%3Fk%3Dlog%2Bin%26ref_%3Dnav_custrec_signin&openid.identity=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&openid.assoc_handle=inflex&openid.mode=checkid_setup&openid.claimed_id=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&openid.ns=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0');
        await page.type('#ap_email', 'roopkishor.pandey@gmail.com');
        await page.click('input[id="continue"]');
        await page.waitForSelector('#ap_password');
        await page.type('#ap_password', 'MoveFast@104785');
        await page.click('input[id="signInSubmit"]');
        await page.waitForSelector('#nav-item-signout > span');
    }
    async execute(page) {
        await page.click("#nav-orders");
        try {
            await page.waitForNavigation();
        }
        catch (TimeoutError) {
            console.log("^^^^^^^^^TimeoutError=" + TimeoutError);
        }
        let elementList = await page.evaluate(() => {
            let listOfStuff = Array.from(document.getElementsByClassName('order-card js-order-card'));
            return listOfStuff.map(heading => heading.innerHTML);
        });
        let product = [];
        for (let i = 0; i < elementList.length; i++) {
            let divElements = elementList[i];
            let price = divElements.substring(divElements.indexOf(">Total</span") + 50, divElements.indexOf(">Total</span") + 100);
            price = price.substring(price.indexOf("secondary") + "secondary".length + 2, price.indexOf("</sp"));
            let productName = divElements.substring(divElements.indexOf("yohtmlc-product-title") + "yohtmlc-product-title".length + 3);
            productName = productName.substring(0, productName.indexOf("</div>")).trim();
            let productLink = divElements.substring(divElements.indexOf("product-image") + "product-image".length, divElements.indexOf("yohtmlc-product-title"));
            productLink = productLink.substring(productLink.indexOf("href=") + "href".length + 2, productLink.indexOf("<img")).trim();
            productLink = productLink.replace("\">", "");
            productLink = "https://www.amazon.in" + productLink;
            var obj = {
                'productName': productName,
                'price': price,
                'productLink': productLink,
            };
            product.push(obj);
        }
        console.log(product);
    }
    async logout(page) {
        await page.goto('https://www.amazon.in/gp/flex/sign-out.html?path=%2Fgp%2Fyourstore%2Fhome&signIn=1&useRedirectOnSuccess=1&action=sign-out&ref_=nav_AccountFlyout_signout');
    }
}
async function initiate() {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    let m = new MyClass();
    await m.login(page);
    await m.execute(page);
    await m.logout(page);
    browser.close();
}
initiate();
