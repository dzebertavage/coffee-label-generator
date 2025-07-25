const date = moment();
let todaysDate = date.add(3, `months`).format("MM/DD/YY");
let sellByDate = moment().add(3, `months`).format("MM/DD/YY");
let coffeeLabel = {
    newDate: `Sell by: ${sellByDate}`,
    coffee: `Click "Edit"`,
    weight: "Net Weight 80oz / 5lbs / 2.27kg"
};

const editBtn = document.querySelector(".edit-btn");
const printBtn = document.querySelector(".print-btn");
const editDialogBox = document.querySelector("#edit-label-dialog");

const labelPreviewBox = document.querySelector(".label-preview");
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
let coffeeNameWrapper = document.querySelector(".coffee-name-wrapper");
let coffeeNameDiv = document.querySelector(".coffee-name");
let coffeeNameWrapperWidth, coffeeNameWrapperHeight;

function setCoffeeNameDimensions() {
    coffeeNameWrapperWidth = coffeeNameWrapper.getBoundingClientRect().width
    coffeeNameWrapperHeight = coffeeNameWrapper.getBoundingClientRect().height
}

function changeCoffeeNameToPx() {
    coffeeNameWrapper.style.width = `${coffeeNameWrapperWidth}px`;
    coffeeNameWrapper.style.height = `${coffeeNameWrapper.style.height}px`;
}

function resizeCoffeeName() {
    requestAnimationFrame(() => {
        setTimeout(() => {
            const wrapper = coffeeNameWrapper;
            const text = coffeeNameDiv;

            let fontSize = 10;
            const maxFontSize = 125;
            const step = 1;

            text.style.fontSize = `${fontSize}px`;
            text.style.whiteSpace = "normal";
            text.style.wordBreak = "normal";
            text.style.overflow = "visible";
            text.style.display = "block";
            text.style.webkitLineClamp = "unset";
            text.style.webkitBoxOrient = "unset";

            while (fontSize <= maxFontSize) {
                text.style.fontSize = `${fontSize}px`;

                const isTooTall = text.scrollHeight > wrapper.clientHeight;
                const isTooWide = text.scrollWidth > wrapper.clientWidth;

                if (isTooTall || isTooWide) {
                    fontSize -= step;
                    text.style.fontSize = `${fontSize}px`;
                    break;
                }
                fontSize += step;
            }

            text.style.display = "-webkit-box";
            text.style.webkitBoxOrient = "vertical";
            text.style.webkitLineClamp = "3";
            text.style.overflow = "hidden";
        }, 10); // delay to give browser time to print layout
    });
}

function displayRangeNum(val) {
    groundNumPreview.textContent = val;
}

function checkWholeOrGround() {
    if (groundRadioBtn.checked) {
        labelPreviewBox.style.gridTemplateRows = "auto 47% auto 27% 9% 6% 6% auto";
        groundCoffeeBanner.style.display = "grid";
        groundCoffeeText.textContent = "Ground #" + groundSlider.value;
    } else {
        labelPreviewBox.style.gridTemplateRows = "auto 47% 0 27% 9% 6% 6% auto";
        groundCoffeeBanner.style.display = "none";
    }
}

function updateDate() {
    let newDateFormatted = newDate.value;
    coffeeLabel.newDate = newDateFormatted.slice(5, 7) + "/" + newDateFormatted.slice(8, 10) + "/" + newDateFormatted.slice(2, 4);
    sellByDateText.textContent = `Sell by: ${coffeeLabel.newDate}`;
}

function resetDate() {
    sellByDateText.textContent = `Sell by: ${moment().add(3, `months`).format("MM/DD/YY")}`;
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
    if (fiveRadio.checked === true) {
        coffeeLabel.weight = "Net Weight 80oz / 5lbs / 2.27kg";
    }
    else if (oneRadio.checked === true) {
        coffeeLabel.weight = "Net Weight 16oz / 1lb / 453g";
    }
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
setCoffeeNameDimensions();
changeCoffeeNameToPx();

document.addEventListener('DOMContentLoaded', () => {
            resizeCoffeeName();
        });

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
    weight.textContent = "Net Weight 80oz / 5lbs / 2.27kg";
    newDate.value = "";
    newDateDiv.style.display = "none";
    editDialogBox.close();
    coffeeNameDiv.textContent = `Click "Edit"`;
    resetDate();
    resizeCoffeeName();
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
                resizeCoffeeName();
                editDialogBox.close();
            }
        }
    } else {
        if (checkCoffeeMatch(coffeePicker.value) === true){
            checkWholeOrGround();
            resetDate();
            updateCoffee(coffeePicker.value);
            updateWeight();
            resizeCoffeeName();
            editDialogBox.close();
        }
        

    }
});

printBtn.addEventListener('click', () => {
    const grind = wholeRadioBtn.checked ? 'whole' : 'ground';
    const coffeeName = coffeeNameDiv.textContent.trim();
    const sellBy = sellByDateText.textContent.trim();
    const size = fiveRadio.checked ? 'five' : 'one';

    fetch('/print-label', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            grind,
            coffeeName,
            sellBy,
            size
        })
    })
    .then(res => res.json())
    .then(data => {
        console.log(data.message);
        alert(data.message);
    })
    .catch(err => {
        console.error('Print failed:', err);
        alert('Something went wrong while sending the print job.');
    });
});
