const fs = require('fs')
const puppeteer = require('puppeteer')



module.exports = async (user) => {
    try {
        const pageUrl = `https://bitrix.gkaktiv.ru/company/personal/user/${user.id}/tasks/departments/`;
        
        const browser = await puppeteer.launch(
            {
                headless: false
            }
        );
        const page = await browser.newPage();
        await page.goto(pageUrl, 
            // {
            //     waitUntil: 'networkidle2 '
            // }
        );
        await page.waitForSelector('input[name="USER_LOGIN"]');
        await page.type('input[name="USER_LOGIN"]', user.name, 
            {delay: 100}
        );
        await page.type('input[name="USER_PASSWORD"]', user.pass, 
            {delay: 100}
            );
        await page.click('input.login-btn');
        await page.waitForSelector('.main-ui-pagination-arrow')
        await page.click('a.main-ui-pagination-arrow')
        
        // await page.waitForXPath("//*[text()='Игорь Ермолович']");
        await page.waitForFunction(() => {
            return Array.from(document.querySelectorAll('body *'))
                .some(element => element.textContent.includes('Игорь Ермолович'));
        });
        // await page.waitForSelector('.new-element');
        let arr = []
        let name = await page.$$eval('div.tasks-grid-username-wrapper > a',
                els => els.map(el => el.innerText)      
        )

        let department = await page.$$eval('div.main-grid-cell-inner > span.main-grid-cell-content > a.js-id-department',
            els => els.map(el => el.innerText)      
    )

        let eff = await page.$$eval('div.main-grid-cell-inner > span.main-grid-cell-content > a[style="color:#333;"]', 
            els => els.map(el => el.innerText)
        )

        let taskAtWork = await page.$$eval('span.tasks-manage-counter-total > a', 
            els => els.map(el => el.innerText)
        )
        for(let i = 0; i < name.length; i++){
            arr.push({name: name[i], eff: eff[i], taskAtWork: taskAtWork[i], department: department[i]},)
        }
        try {
            // fs.unlinkSync('../ActiveApp/active/src/components/' + user.path + '/' + user.path + '.json',
            //     (err => {
            //         if (err) console.log(err);
            //         else {
            //             console.log("\nDeleted file: filename.json");
            //         }
            //     })
            // )
            fs.unlinkSync('../ActiveParser/files/active.json')
        } catch (error) {
            // await browser.close()
            console.log(error)
        }
        
        let acc

        const groupedByDep = arr.reduce((acc, person) => {
            // Проверяем, существует ли группа для текущего возраста
            if (!acc[person.department]) {
                acc[person.department] = [];  // Если нет, создаем её
            }
            acc[person.department].push(person);  // Добавляем объект в нужную группу
            return acc;  // Возвращаем аккумулирующий объект
        }, {});
        // console.log(groupedByDep);
        acc = groupedByDep
        const json = JSON.stringify(acc).replace(/(?=[,\[\]])/, ' \n')
        fs.writeFileSync('../ActiveParser/files/active.json', json);  
        // fs.writeFileSync('../ActiveApp/active/src/components/' + user.path + '/' + user.path + '.json', json);     
        console.log('parseend')
        await browser.close()
    } catch (error) {
        await browser.close()

        console.log(error)
    }
} 
