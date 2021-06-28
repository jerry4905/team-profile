const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");

let employeeCount = 0;
let employeeArray = [];
let employeeObject = {};
let employeeCounter = 0;

async function init() {
        try {
            await inquirer.prompt(
                {
                    type: 'input',
                    message: 'How many employees do you have?',
                    name: 'numberEmployees'
                }
            ).then(function(response){
                employeeCount = parseInt(response.numberEmployees);
            })

            await inquirer.prompt(
                [
                    {
                        type: 'input',
                        message: `What is your name?`,
                        name: 'name'
                    },
                    {
                        type: 'input',
                        message: `What is your email address?`,
                        name: 'email'
                    },
                    {
                        type: 'input',
                        message: `What is your office number?`,
                        name: 'officeNumber'
                    }
                ]
            ).then(function(response){
                employeeObject = response;
                employeeObject.id = 1;
                employeeObject.officeNumber = response.officeNumber;
                const manager = new Manager(employeeObject.name, employeeObject.id, employeeObject.email, employeeObject.officeNumber);
                employeeArray.push(manager);
            })

            for (i = 0; i < employeeCount; i++) {
                employeeCounter++;
                await inquirer.prompt(
                    [
                        {
                            type: 'input',
                            message: `What is employee #${employeeCounter}'s name?`,
                            name: 'name'
                        },
                        {
                            type: 'list',
                            message: `What is the employee #${employeeCounter}'s occupation?`,
                            name: 'occupation',
                            choices: ['Engineer', 'Intern']
                        },
                        {
                            type: 'input',
                            message: `What is the employee #${employeeCounter}'s email address?`,
                            name: 'email'
                        }
                    ]
                ).then(function(response){
                    employeeObject = response;
                    employeeObject.id = i + 2; 
                });

                if (employeeObject.occupation === 'Engineer') {
                    await inquirer.prompt(
                        {
                            type: 'input',
                            message: `What is the employee #${employeeCounter}'s Github username?`,
                            name: 'github'
                        }
                    ).then(function(response){
                        employeeObject.github = response.github; 
                        const engineer = new Engineer(employeeObject.name, employeeObject.id, employeeObject.email, employeeObject.github);
                        employeeArray.push(engineer);
                    });
                }

                else if (employeeObject.occupation === 'Intern') {
                    await inquirer.prompt(
                        {
                            type: 'input',
                            message: `What is the employee #${employeeCounter}'s school?`,
                            name: 'school'
                        }
                    ).then(function(response){
                        employeeObject.school = response.school;
                        const intern = new Intern(employeeObject.name, employeeObject.id, employeeObject.email, employeeObject.school);
                        employeeArray.push(intern);
                    });
                }

            }

            await render(employeeArray);

            fs.writeFile(outputPath, render(employeeArray), function(err) {
                if (err) {
                    return console.log(err);
                }
                
                  console.log("Success!");   
            });

        } catch (err) {
            console.log(err);
        }
    }

init();