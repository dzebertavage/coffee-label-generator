const date = moment();
let sellByDate = date.add(3, `months`).format("MM/DD/YY");

const editBtn = document.querySelector(".edit-btn");
const printBtn = document.querySelector(".print-btn");
const editDialogBox = document.querySelector("#edit-label-dialog");

const wholeRadioBtn = document.querySelector("#whole");
const groundRadioBtn = document.querySelector("#ground");
const groundSliderDiv = document.querySelector(".ground-select");
const groundSlider = document.querySelector("#groundSelectRange");
const groundNumPreview = document.querySelector(".groundNumPreview");
const fiveRadio = document.querySelector("#five");
const oneRadio = document.querySelector("#one");
const changeDateCheckbox = document.querySelector("#changeDate");
const newDateDiv = document.querySelector(".new-date");
const newDate = document.querySelector("#newDate");
const sellByDateText = document.querySelector(".sell-by-date");

const groundSliderBox = document.querySelector(".ground-select");

groundSliderBox.style.display = 'none';
sellByDateText.textContent = sellByDate;

editBtn.addEventListener('click', () => {
    editDialogBox.showModal();
});

