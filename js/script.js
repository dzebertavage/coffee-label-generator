const date = moment();
let todaysDate = date.add(3, `months`).format("MM/DD/YY");
let sellByDate = moment().add(3, `months`).format("MM/DD/YY");
let coffeeLabel = {
    newDate: sellByDate,
    coffee: "HOUSE BLEND",
    weight: "Net Weight 80oz / 5lbs / 2.27kg"
};

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
let sellByDateText = document.querySelector(".sell-by-date");
let dateInput;
const weight = document.querySelector(".weight");
const groundCoffeeBanner = document.querySelector(".ground-coffee-banner");
const groundSliderBox = document.querySelector(".ground-select");
const coffeePicker = document.querySelector("#coffee");
const coffeeDatalist = document.querySelector("#coffeeOptions");
const coffeeOptionsArr = [];
let coffeeInput;
let newCoffee;
const discardBtn = document.querySelector(".discard-btn");
const keepBtn = document.querySelector(".keep-btn");
const groundCoffeeText = document.querySelector(".ground-coffee-text");
let coffeeNameDiv = document.querySelector(".coffee-name");

function displayRangeNum(val) {
    groundNumPreview.textContent = val;
}

function checkWholeOrGround() {
    if (groundRadioBtn.checked) {
        groundCoffeeBanner.style.display = "grid";
        groundCoffeeText.textContent = "Ground #" + groundSlider.value;
        // Set grid numbers to equal 95%
    } else {
        groundCoffeeBanner.style.display = "none";
        // set grid numbers to equal 100%
    }
}

function updateDate() {
    let newDateFormatted = newDate.value;
    coffeeLabel.newDate = newDateFormatted.slice(5, 7) + "/" + newDateFormatted.slice(8, 10) + "/" + newDateFormatted.slice(2, 4);
    sellByDateText.textContent = coffeeLabel.newDate;
}

function checkCoffeeMatch(coffeeInput) {
    if (coffeeOptionsArr.includes(coffeeInput)) {
        return true;
    } else {
        alert("Please enter a valid coffee!");
        return false;
    }
}

function updateCoffee(newCoffee) {
    newCoffee = coffeePicker.value;
    coffeeNameDiv.textContent = newCoffee;
}

function updateWeight() {
    weight.textContent = coffeeLabel.weight;
}

function getCoffeeOptions() {
    let options = coffeeDatalist.options;
    for (let i = 0; i < options.length; i++) {
        coffeeOptionsArr[i] = options[i].value;
    }
}

sellByDateText.textContent = coffeeLabel.newDate;
coffeeNameDiv.textContent = coffeeLabel.coffee;
weight.textContent = coffeeLabel.weight;
getCoffeeOptions();

editBtn.addEventListener('click', () => {
    editDialogBox.showModal();
    changeDateCheckbox.checked = false;
    coffeePicker.value = "";
    wholeRadioBtn.checked = true;
    groundSliderBox.style.display = "none";
    fiveRadio.checked = true;
    newDate.value = "";
    newDateDiv.style.display = "none";
    groundCoffeeBanner.style.display = "none";
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

fiveRadio.addEventListener('change', (event) => {
    if (event.target.checked) {
        coffeeLabel.weight = "Net Weight 80oz / 5lbs / 2.27kg";
    }
});

oneRadio.addEventListener('change', (event) => {
    if (event.target.checked) {
        coffeeLabel.weight = "Net Weight 16oz / 1lb / 453g";
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
    editDialogBox.close();
    coffeeNameDiv.textContent = "Click \"Edit\" to make a label";
});

keepBtn.addEventListener('click', () => {
    if (changeDateCheckbox.checked) {
        if (checkCoffeeMatch(coffeePicker.value) === true){
            if (newDate.value === "") {
                alert(`Please choose a date or uncheck the \"Change date\" checkbox!`);
            } else {
                checkWholeOrGround();
                updateDate(); 
                updateCoffee(coffeePicker.value);
                updateWeight();
                editDialogBox.close();
            }
        }
    } else {
        if (checkCoffeeMatch(coffeePicker.value) === true){
            checkWholeOrGround();
            updateCoffee(coffeePicker.value);
            updateWeight();
            editDialogBox.close();
        }
        

    }
});