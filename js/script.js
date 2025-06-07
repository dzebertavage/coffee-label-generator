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
const weight = document.querySelector(".weight");
const groundCoffeeBanner = document.querySelector(".ground-coffee-banner");
const groundSliderBox = document.querySelector(".ground-select");
const coffeePicker = document.querySelector("#coffee");
const discardBtn = document.querySelector(".discard-btn");
const keepBtn = document.querySelector(".keep-btn");
const groundCoffeeText = document.querySelector(".ground-coffee-text");

function displayRangeNum(val) {
    groundNumPreview.textContent = val;
}

sellByDateText.textContent = sellByDate;

editBtn.addEventListener('click', () => {
    editDialogBox.showModal();
    changeDateCheckbox.checked = false;
    coffeePicker.value = "";
    wholeRadioBtn.checked = true;
    groundSliderBox.style.display = "none";
    fiveRadio.checked = true;
    newDate.value = "";
    newDateDiv.style.display = "none";
});

groundRadioBtn.addEventListener('change', (event) => {
    if (event.target.checked) {
        groundSliderBox.style.display = "grid";
        groundNumPreview.textContent = groundSlider.value;
    }
});

wholeRadioBtn.addEventListener('change', (event) => {
    if (event.target.checked) {
        groundSliderBox.style.display = "none";
        groundSlider.value = 5;
        groundNumPreview.textContent = groundSlider.value;
    }
});

changeDateCheckbox.addEventListener('change', () => {
    if (changeDateCheckbox.checked) {
        newDateDiv.style.display = "grid";
    } else {
        newDateDiv.style.display = "none";
    }
});

discardBtn.addEventListener('click', () => {
    changeDateCheckbox.checked = false;
    coffeePicker.value = "";
    wholeRadioBtn.checked = true;
    groundSliderBox.style.display = "none";
    fiveRadio.checked = true;
    newDate.value = "";
    newDateDiv.style.display = "none";
});

keepBtn.addEventListener('click', () => {
    if (groundRadioBtn.checked) {
        groundCoffeeBanner.style.display = "grid";
        groundCoffeeText.textContent = "Ground #" + groundSlider.value;
    } else {
        groundCoffeeBanner.style.display = "none";
    }
    
});