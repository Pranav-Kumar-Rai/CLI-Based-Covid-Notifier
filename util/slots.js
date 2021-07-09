const axios = require('axios');
const Table = require('tty-table')
const { config, options } = require('./config')
var inquirer = require('inquirer')
const notifier = require('node-notifier');

module.exports = function (districtid) {
  var today = new Date();
  var dd = today.getDate();

  var mm = today.getMonth() + 1;
  var yyyy = today.getFullYear();
  if (dd < 10) {
    dd = '0' + dd;
  }

  if (mm < 10) {
    mm = '0' + mm;
  }
  today = dd + '-' + mm + '-' + yyyy;

  // console.log(today);

  inquirer
    .prompt([
      {
        type: "list",
        name : "choice",
        message: "Select One",
        choices: [
          {
            name:"All Ages",
            value:""
          },
          {
            name:"45+",
            value:"45"
          },
          {
            name:"18-45",
            value:"18"
          }
        ]
      }
    ])
    .then((answers) => {
      axios.get(`https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByDistrict?district_id=${districtid}&date=${today}`, config)
        .then(function (response) {
          // handle success
          // console.table(response.data.states);

          let header = [{
            value: "date",
            headerColor: "cyan",
            color: "white",
            align: "left",
            alias: "Date",
            width: 15
          },
          {
            value: "center",
            color: "red",
            alias: "Center Name",
            width: 30,
          }, {
            value: "address",
            color: "red",
            alias: "Center Address",
            width: 40,
          }, {
            value: "available",
            color: "red",
            alias: "Dose Available",
            width: 10,
          }, {
            value: "age",
            color: "red",
            alias: "Age",
            width: 10,
          }]

          // console.log(response.data.centers);
          let finalData = [];
          let flag=0;
          
          // console.log(response.data.centers);
          response.data.centers.forEach(item => {
            item.sessions.forEach(curr => {

              if(curr.available_capacity >= '0')
              {
                flag=1;
              }
              if(answers.choice == "")
              {
                let ourData = {
                  date: curr.date,
                  available: curr.available_capacity,
                  age: curr.min_age_limit,
                  center: item.name,
                  address: item.address
                }
  
                finalData.push(ourData);
              }

              else if(answers.choice == curr.min_age_limit)
              {
                let ourData = {
                  date: curr.date,
                  available: curr.available_capacity,
                  age: curr.min_age_limit,
                  center: item.name,
                  address: item.address
                }
  
                finalData.push(ourData);
              }
              
            })
          });

          // console.log(finalData);
          const out = Table(header, finalData, options).render()
          console.log(out);

          if(flag==1)
          {
            notifier.notify({
              title: 'My notification',
              message: 'Hello, there!',
              wait:true
            });
          }
          

          // break;

          
        })
        .catch(function (error) {
          // handle error
          console.log(error);
        })
    })
    .catch((error) => {
      if (error.isTtyError) {
        // Prompt couldn't be rendered in the current environment
      } else {
        // Something else went wrong
      }
    });


}