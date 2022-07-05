//express framework
const express = require("express");
// node built-in http module
const https = require("https");
//mailchimp
const mailchimp = require("@mailchimp/mailchimp_marketing");

const app = express();
//use instead of body-parser
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

app.get('/', (request, response) => {
  response.sendFile(__dirname + "/signup.html");
});

app.post('/', (req, res) => {

  const fName = req.body.firstName;
  const lName = req.body.lastName;
  const email = req.body.email;
  //Creating an object with the users data
  const subscribingUser = {
    fName,
    lName,
    email
  };

  mailchimp.setConfig({
    apiKey: "44da807b5bceafff8dfe5790ca64dc35-us9",
    server: "us9"
  });

  const listId = "21952a35a2";

  async function run() {

    const response = await mailchimp.lists.addListMember(listId, {
      email_address: subscribingUser.email,
      status: "subscribed",
      merge_fields: {
        FNAME: subscribingUser.fName,
        LNAME: subscribingUser.lName
      }
    });

    //success added
    console.log(`Successfully added contact as an audience member. The contact's id is ${response.id}.`
    );
  }

  run()
    .then(() => res.sendFile(__dirname + "/success.html"))
    .catch(() => res.sendFile(__dirname + "/failure.html"));
});


app.post("/failure", (req, res) => {
  res.redirect("/");
});
app.listen(process.env.PORT || 3000, () => console.log("Server set up"));