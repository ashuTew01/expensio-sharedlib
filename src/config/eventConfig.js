export const EVENTS = {
	USER_DELETED: "UserDeleted",
	USER_DELETION_FAILED: "UserDeletionFailed",
	USER_DELETION_UNDONE: "UserDeletionUndone",
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
