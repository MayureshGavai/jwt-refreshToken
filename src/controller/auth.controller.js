import { getAllUsers } from "../model/auth.model.js";

export const fetchAllUsers = async (req, res) => {
    try {
        const users = await getAllUsers();
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch users data' });
    }
}
