import asyncio
from playwright.async_api import async_playwright
import json

async def check():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()
        await page.goto('http://127.0.0.1:8004/contacto/', wait_until='networkidle')

        form_styles = await page.evaluate('''() => {
            const form = document.querySelector('.contact-form');
            if (!form) return 'no form found';
            const style = window.getComputedStyle(form);
            return {
                backgroundColor: style.backgroundColor,
                borderColor: style.borderColor,
                borderRadius: style.borderRadius,
                padding: style.padding
            };
        }''')

        submit_styles = await page.evaluate('''() => {
            const btn = document.querySelector('.contact-form__submit');
            if (!btn) return 'no submit button found';
            const style = window.getComputedStyle(btn);
            return {
                backgroundColor: style.backgroundColor,
                color: style.color,
                borderRadius: style.borderRadius,
                padding: style.padding,
                fontFamily: style.fontFamily
            };
        }''')

        h1_styles = await page.evaluate('''() => {
            const h1 = document.querySelector('h1');
            if (!h1) return 'no h1 found';
            const style = window.getComputedStyle(h1);
            return {
                color: style.color,
                fontFamily: style.fontFamily,
                fontSize: style.fontSize
            };
        }''')

        wa_styles = await page.evaluate('''() => {
            const a = document.querySelector('.alt-contact__whatsapp');
            if (!a) return 'no whatsapp found';
            const style = window.getComputedStyle(a);
            return {
                backgroundColor: style.backgroundColor,
                color: style.color,
                borderRadius: style.borderRadius,
                padding: style.padding
            };
        }''')

        social_styles = await page.evaluate('''() => {
            const items = document.querySelectorAll('.social-item');
            if (items.length === 0) return 'no social items';
            const results = [];
            items.forEach(item => {
                const style = window.getComputedStyle(item);
                results.push({
                    color: style.color,
                    fontFamily: style.fontFamily,
                    fontSize: style.fontSize,
                    borderRadius: style.borderRadius
                });
            });
            return results;
        }''')

        tokens = await page.evaluate('''() => {
            const root = getComputedStyle(document.documentElement);
            return {
                primary: root.getPropertyValue('--primary'),
                secondary: root.getPropertyValue('--secondary'),
                whatsapp: root.getPropertyValue('--whatsapp'),
                fontStack: root.getPropertyValue('--font-stack')
            };
        }''')

        print('TOKENS:', json.dumps(tokens, indent=2))
        print('FORM:', json.dumps(form_styles, indent=2))
        print('SUBMIT:', json.dumps(submit_styles, indent=2))
        print('H1:', json.dumps(h1_styles, indent=2))
        print('WHATSAPP:', json.dumps(wa_styles, indent=2))
        print('SOCIAL:', json.dumps(social_styles, indent=2))

        await browser.close()

asyncio.run(check())
