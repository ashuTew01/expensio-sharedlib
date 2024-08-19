/**
 * @typedef {Object} Events
 * @property {string} USER_DELETED
 * @property {string} USER_DELETION_FAILED
 * @property {string} USER_DELETION_UNDONE
 * @property {string} EXPENSE_CREATED
 */

/** @type {Events} */
export const EVENTS = {
	USER_DELETED: "USER_DELETED",
	USER_DELETION_FAILED: "USER_DELETION_FAILED",
	USER_DELETION_UNDONE: "USER_DELETION_UNDONE",
	EXPENSE_CREATED: "EXPENSE_CREATED",
};

/**
 * @typedef {Object} Exchanges
 * @property {string} USER
 * @property {string} EXPENSE
 */

/** @type {Exchanges} */
export const EXCHANGES = {
	USER: "user-events",
	EXPENSE: "expense-events",
	// add new exchanges here
};

/**
 * @typedef {Object} RoutingKeys
 * @property {string} USER_DELETED
 * @property {string} USER_DELETION_FAILED
 * @property {string} USER_DELETION_UNDONE
 * @property {string} EXPENSE_CREATED
 */

/** @type {RoutingKeys} */
export const ROUTING_KEYS = {
	USER_DELETED: "user.deleted",
	USER_DELETION_FAILED: "user.deletion.failed",
	USER_DELETION_UNDONE: "user.deletion.undone",
	EXPENSE_CREATED: "expense.created",
	// add new routing keys here
};
