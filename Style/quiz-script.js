let currentStep = 1;
const totalSteps = 14;
const formSteps = document.querySelectorAll('.form-step');
const progressSteps = document.querySelectorAll('.progress-step');
const progressFill = document.getElementById('progressFill');
const nextBtn = document.getElementById('nextBtn');
const prevBtn = document.getElementById('prevBtn');
const errorMessage = document.getElementById('errorMessage');
const form = document.getElementById('multiStepForm');
const successMessage = document.getElementById('successMessage');

function updateProgress() {
	const progress = ((currentStep - 1) / (totalSteps - 1)) * 100;
	progressFill.style.width = progress + '%';
	progressSteps.forEach((step, index) => {
		const stepNum = index + 1;
		step.classList.remove('active', 'completed');
		if (stepNum < currentStep) {
			step.classList.add('completed');
		} else if (stepNum === currentStep) {
			step.classList.add('active');
		}
	});

	formSteps.forEach(step => {
		step.classList.remove('active');
		if (parseInt(step.dataset.step) === currentStep) {
			step.classList.add('active');
		}
	});

            prevBtn.style.display = currentStep === 1 ? 'none' : 'block';
            nextBtn.textContent = currentStep === totalSteps ? 'Submit' : 'Continue';
            errorMessage.classList.remove('active');
}

function validateStep() {
	const currentStepElement = document.querySelector(`.form-step[data-step="${currentStep}"]`);
	const requiredInputs = currentStepElement.querySelectorAll('[required]');
	for (let input of requiredInputs) {
		if (!input.value.trim()) {
			errorMessage.textContent = 'Please fill in all required fields';
			errorMessage.classList.add('active');
			input.focus();
			return false;
		}
		 if (input.type === 'email' && !isValidEmail(input.value)) {
			errorMessage.textContent = 'Please enter a valid email address';
			errorMessage.classList.add('active');
			input.focus();
			return false;
		}
		if (input.type === 'radio') {
			const radioGroup = currentStepElement.querySelectorAll(`[name="${input.name}"]`);
			const isChecked = Array.from(radioGroup).some(radio => radio.checked);
			if (!isChecked) {
				errorMessage.textContent = 'Please select an option';
				errorMessage.classList.add('active');
				return false;
			}
		}
	}
	return true;
}

function isValidEmail(email) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);}

function collectFormData() {
	const formData = new FormData(form);
	const data = {};
	formData.forEach((value, key) => { data[key] = value;});
	return data;
}

nextBtn.addEventListener('click', () => {
	if (!validateStep()) {return;}
	if (currentStep === totalSteps) {
		const formData = collectFormData();
		console.log('Form submitted:', formData);
		form.style.display = 'none';
		document.querySelector('.progress-container').style.display = 'none';
		document.querySelector('.button-group').style.display = 'none';
		form.submit();
		successMessage.classList.add('active');
		for (let i = 0; i < form.elements.length; i++) {
			const element = form.elements[i];
			if (element.id) {
				localStorage.removeItem(element.id);
			}
		}
	} else {
		currentStep++;
		updateProgress();
	}
});

prevBtn.addEventListener('click', () => {
	if (currentStep > 1) {
		currentStep--;
		updateProgress();
	}
});

form.addEventListener('keypress', (e) => {
	if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
		e.preventDefault();
		nextBtn.click();
	}
});

updateProgress();

// Save form data to localStorage on input change
document.addEventListener('DOMContentLoaded', () => {
	if (form) {
		for (let i = 0; i < form.elements.length; i++) {
			const element = form.elements[i];
			const savedValue = localStorage.getItem(element.id);
			if (savedValue !== null) {
				if (element.type === 'checkbox' || element.type === 'radio') {
					element.checked = (savedValue === 'true');
				} else {
					element.value = savedValue;
				}
			}
		}

		// Save data on input change
		form.addEventListener('input', (event) => {
			const element = event.target;
			if (element.id) { // Ensure the element has an ID
 				if (element.type === 'checkbox' || element.type === 'radio') {
					localStorage.setItem(element.id, element.checked);
				} else {
					localStorage.setItem(element.id, element.value);
				}
			}
		});
	}
});