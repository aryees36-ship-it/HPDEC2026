//======================================================
// HPD EVIDENCE SUMMIT REGISTRATION SYSTEM
//======================================================

//------------------------------------------------------
// GOOGLE APPS SCRIPT URL
//------------------------------------------------------

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxFblsCiOPgHBd7bs_n9Jjo6EV25nVwfL3WNWShaGL6ZQpUVTcHnifRasD6Ss90xZT_xA/exec";


//------------------------------------------------------
// FORM
//------------------------------------------------------

const form = document.getElementById("registrationForm");

const submitBtn = document.getElementById("submitBtn");

const loading = document.getElementById("loading");


//------------------------------------------------------
// AGENCY TOGGLE
//------------------------------------------------------

const agency = document.getElementById("agency");
const otherAgency = document.getElementById("otherAgency");

agency.addEventListener("change", () => {

    if (agency.value === "Others") {

        otherAgency.style.display = "block";
        otherAgency.required = true;

    } else {

        otherAgency.style.display = "none";
        otherAgency.required = false;
        otherAgency.value = "";

    }

});


//------------------------------------------------------
// PAYMENT TOGGLE
//------------------------------------------------------

const paymentDone = document.getElementById("paymentDone");

const transactionBox = document.getElementById("transactionBox");

const transactionId = document.getElementById("transactionId");

paymentDone.addEventListener("change", () => {

    if(paymentDone.value === "Yes"){

        transactionBox.style.display = "block";
        transactionId.required = true;

    }else{

        transactionBox.style.display = "none";
        transactionId.required = false;
        transactionId.value = "";

    }

});


//------------------------------------------------------
// DISTRICT LOADER
//------------------------------------------------------

let districtData = {};

fetch("districts.json")

.then(res=>res.json())

.then(data=>{

    districtData=data;

})

.catch(err=>{

    console.log(err);

});


const region=document.getElementById("region");

const district=document.getElementById("district");

region.addEventListener("change",()=>{

    district.innerHTML="<option value=''>Select District</option>";

    if(!districtData[region.value]) return;

    districtData[region.value].forEach(d=>{

        let option=document.createElement("option");

        option.value=d;

        option.textContent=d;

        district.appendChild(option);

    });

});
//------------------------------------------------------
// FORM SUBMISSION
//------------------------------------------------------

form.addEventListener("submit", function(e){

    e.preventDefault();


    // Disable button
    submitBtn.disabled = true;

    loading.style.display="block";


    // Collect Form Data

    const registrationData = {


        name:
        document.getElementById("name").value.trim(),


        staffId:
        document.getElementById("staffId").value.trim(),


        gender:
        document.getElementById("gender").value,


        agency:
        agency.value === "Others"
        ?
        otherAgency.value
        :
        agency.value,


        department:
        document.getElementById("department").value.trim(),


        position:
        document.getElementById("position").value.trim(),


        region:
        region.value,


        district:
        district.value,


        phone:
        document.getElementById("phone").value.trim(),


        email:
        document.getElementById("email").value.trim(),


        paymentDone:
        paymentDone.value,


        transactionId:
        transactionId.value.trim()


    };



    //--------------------------------------------------
    // SEND DATA TO GOOGLE APPS SCRIPT
    //--------------------------------------------------


    fetch(SCRIPT_URL,{

        method:"POST",

        body:JSON.stringify(registrationData)

    })

    .then(response=>response.json())


    .then(result=>{


        loading.style.display="none";

        submitBtn.disabled=false;



        if(result.status==="success"){


            showSuccess(result, registrationData);


            form.reset();


            transactionBox.style.display="none";


        }

        else{


            alert(result.message);


        }



    })


    .catch(error=>{


        console.error(error);


        loading.style.display="none";

        submitBtn.disabled=false;


        alert(
        "Unable to submit registration. Please check your internet connection."
        );


    });



});




//------------------------------------------------------
// SUCCESS MODAL DISPLAY
//------------------------------------------------------

function showSuccess(result, data){


    document.getElementById("s_name").innerHTML =
    data.name;


    document.getElementById("s_department").innerHTML =
    data.department;


    document.getElementById("s_position").innerHTML =
    data.position;


    document.getElementById("s_region").innerHTML =
    data.region;


    document.getElementById("s_district").innerHTML =
    data.district;



    document.getElementById("successText").innerHTML =
    result.registrationCode;



    if(result.qrCode){

        document.getElementById("qrImage").src =
        result.qrCode;

    }



    // Store data for PDF download

    window.registrationInfo = {


        name:data.name,

        staffId:data.staffId,

        gender:data.gender,

        agency:data.agency,

        department:data.department,

        position:data.position,

        region:data.region,

        district:data.district,

        phone:data.phone,

        email:data.email,

        paymentDone:data.paymentDone,

        transactionId:data.transactionId,


        registrationCode:
        result.registrationCode,


        qrCode:
        result.qrCode

    };



    const modal =
    new bootstrap.Modal(
        document.getElementById("successModal")
    );


    modal.show();

}
//------------------------------------------------------
// DOWNLOAD REGISTRATION SLIP PDF (UPDATED)
//------------------------------------------------------
//------------------------------------------------------
// DOWNLOAD REGISTRATION SLIP PDF (NO LOGO / NO QR)
//------------------------------------------------------

function downloadSlip() {

    if (!window.registrationInfo) {

        alert("Registration information not available.");
        return;

    }


    const { jsPDF } = window.jspdf;

    const doc = new jsPDF("p","mm","a4");


    const data = window.registrationInfo;



    //---------------------------------------------
    // PAGE BACKGROUND
    //---------------------------------------------

    doc.setFillColor(245,247,250);
    doc.rect(0,0,210,297,"F");



    //---------------------------------------------
    // HEADER
    //---------------------------------------------

    doc.setFillColor(0,107,63);
    doc.rect(0,0,210,40,"F");


    doc.setTextColor(255,255,255);

    doc.setFont("helvetica","bold");
    doc.setFontSize(18);

    doc.text(
        "Health Promotion Division",
        105,
        15,
        {align:"center"}
    );


    doc.setFontSize(13);

    doc.text(
        "Evidence Summit Registration Slip",
        105,
        25,
        {align:"center"}
    );


    doc.setFontSize(10);

    doc.text(
        "Ghana Health Service",
        105,
        33,
        {align:"center"}
    );



    //---------------------------------------------
    // REGISTRATION CODE BOX
    //---------------------------------------------

    doc.setFillColor(233,245,237);

    doc.roundedRect(
        20,
        50,
        170,
        25,
        4,
        4,
        "F"
    );


    doc.setTextColor(0,107,63);

    doc.setFontSize(11);

    doc.text(
        "Registration Code",
        105,
        60,
        {align:"center"}
    );


    doc.setFontSize(16);

    doc.setFont("helvetica","bold");

    doc.text(
        data.registrationCode,
        105,
        70,
        {align:"center"}
    );



    //---------------------------------------------
    // PARTICIPANT INFORMATION
    //---------------------------------------------


    doc.setTextColor(0,0,0);

    doc.setFontSize(12);

    doc.text(
        "Participant Details",
        20,
        90
    );


    doc.setFontSize(11);


    let y = 105;


    function addRow(label,value){

        doc.setFont("helvetica","bold");

        doc.text(
            label,
            25,
            y
        );


        doc.setFont("helvetica","normal");

        doc.text(
            value || "-",
            75,
            y
        );


        y += 10;

    }



    addRow("Name:",data.name);

    addRow("Staff ID:",data.staffId);

    addRow("Gender:",data.gender);

    addRow("Agency:",data.agency);

    addRow("Department:",data.department);

    addRow("Position:",data.position);

    addRow("Region:",data.region);

    addRow("District:",data.district);

    addRow("Phone:",data.phone);

    addRow("Email:",data.email);

    addRow("Payment Status:",
    data.paymentDone);



    //---------------------------------------------
    // CONFIRMATION BOX
    //---------------------------------------------


    doc.setFillColor(0,160,80);

    doc.roundedRect(
        55,
        230,
        100,
        20,
        5,
        5,
        "F"
    );


    doc.setTextColor(255,255,255);

    doc.setFontSize(14);

    doc.text(
        "CONFIRMED",
        105,
        243,
        {align:"center"}
    );



    //---------------------------------------------
    // FOOTER
    //---------------------------------------------


    doc.setFillColor(0,107,63);

    doc.rect(
        0,
        280,
        210,
        17,
        "F"
    );


    doc.setFontSize(9);

    doc.text(
        "Health Promotion Division | Ghana Health Service | Evidence Summit 2026",
        105,
        290,
        {align:"center"}
    );



    //---------------------------------------------
    // SAVE FILE
    //---------------------------------------------


    doc.save(
        "HPD_Evidence_Summit_Registration.pdf"
    );

}
