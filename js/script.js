const editBtn = document.querySelector(".edit-btn");
const printBtn = document.querySelector(".print-btn");
const editDialogBox = document.querySelector("#edit-label-dialog");
const groundSliderBox = document.querySelector(".ground-select");

groundSliderBox.style.display = 'none';

editBtn.addEventListener('click', () => {
    editDialogBox.showModal();
});