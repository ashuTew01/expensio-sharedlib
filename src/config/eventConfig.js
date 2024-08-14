export const EVENTS = {
	USER_DELETED: "USER_DELETED",
	USER_DELETION_FAILED: "USER_DELETION_FAILED",
	USER_DELETION_UNDONE: "USER_DELETION_UNDONE",
};

export const EXCHANGES = {
	USER: "user-events",
	EXPENSE: "expense-events",
	// add new exchanges here
};

export const ROUTING_KEYS = {
	USER_DELETED: "user.deleted",
	USER_DELETION_FAILED: "user.deletion.failed",
	USER_DELETION_UNDONE: "user.deletion.undone",
	// add new routing keys here
};
