export function toCamelCase(input: string): string {
	if (isCamelCase(input)) {
		return input;
	}

	const cleanedString = input.replace(/[^a-zA-Z0-9]+/g, " ");

	// Split the string into words
	const words = cleanedString.split(" ");

	// Capitalize the first letter of each word (except the first one)
	const camelCaseWords = words.map((word, index) => {
		if (index === 0) {
			return word.toLowerCase();
		}
		return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
	});

	// Join the words back together
	return camelCaseWords.join("");
}

export function isCamelCase(input: string): boolean {
	// Check if the string is empty or starts with a number
	if (input.length === 0 || /^\d/.test(input)) {
		return false;
	}

	// Check if the first character is lowercase
	if (input[0] !== input[0].toLowerCase()) {
		return false;
	}

	// Check if the string contains any non-alphanumeric characters
	if (/[^a-zA-Z0-9]/.test(input)) {
		return false;
	}

	// Check if there's at least one uppercase letter after the first character
	if (!/[A-Z]/.test(input.slice(1))) {
		return false;
	}

	// Check if there are any adjacent uppercase letters
	if (/[A-Z]{2,}/.test(input)) {
		return false;
	}

	return true;
}

// Keep the existing toCamelCase function here as well
