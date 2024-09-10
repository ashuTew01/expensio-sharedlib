//first word before_ should be same as the exchange.
const eventNames = [
	//user events...
	"USER_DELETED",
	"USER_DELETION_FAILED",
	"USER_DELETION_UNDONE",

	//expense events...
	"EXPENSE_CREATED",
	"EXPENSE_DELETED",

	//income events...
	"INCOME_CREATED",
	"INCOME_DELETED",

	//financial data events...
	"FINANCIALDATA_UPDATED_EXPENSE",
	"FINANCIALDATA_UPDATED_INCOME",
];

export const EVENTS = eventNames.reduce((acc, eventName) => {
	acc[eventName] = eventName;
	return acc;
}, {});

export const EXCHANGES = {
	USER: "user-events",
	EXPENSE: "expense-events",
	FINANCIALDATA: "financial-data-events",
	INCOME: "income-events",
	// Add new exchanges here
};

export const ROUTING_KEYS = eventNames.reduce((keys, event) => {
	const routingKey = event.toLowerCase().replace(/_/g, ".");
	keys[event] = routingKey;
	return keys;
}, {});

// ******************* KAKFA ***************************
export const TOPICS = {
	USER: "user-events",
	EXPENSE: "expense-events",
	FINANCIALDATA: "financial-data-events",
	INCOME: "income-events",
	// Add new exchanges here
};
