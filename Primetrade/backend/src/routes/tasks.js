const router = require('express').Router();
const { body, validationResult } = require('express-validator');
const { pool } = require('../models/db');
const { authenticate, requireRole } = require('../middleware/auth');

/**
 * @swagger
 * /api/v1/tasks:
 *   get:
 *     summary: Get tasks (own tasks for user, all for admin)
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200: { description: List of tasks }
 */
router.get('/', authenticate, async (req, res) => {
  try {
    const isAdmin = req.user.role === 'admin';
    const { rows } = await pool.query(
      isAdmin
        ? 'SELECT t.*, u.name as owner FROM tasks t JOIN users u ON t.user_id = u.id ORDER BY t.created_at DESC'
        : 'SELECT * FROM tasks WHERE user_id = $1 ORDER BY created_at DESC',
      isAdmin ? [] : [req.user.id]
    );
    res.json(rows);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @swagger
 * /api/v1/tasks/{id}:
 *   get:
 *     summary: Get a single task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Task data }
 *       404: { description: Not found }
 */
router.get('/:id', authenticate, async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM tasks WHERE id = $1', [req.params.id]);
  if (!rows[0]) return res.status(404).json({ error: 'Task not found' });
  if (req.user.role !== 'admin' && rows[0].user_id !== req.user.id)
    return res.status(403).json({ error: 'Access denied' });
  res.json(rows[0]);
});

/**
 * @swagger
 * /api/v1/tasks:
 *   post:
 *     summary: Create a new task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title]
 *             properties:
 *               title: { type: string }
 *               description: { type: string }
 *               status: { type: string, enum: [pending, in_progress, done] }
 *     responses:
 *       201: { description: Task created }
 */
router.post('/', authenticate, [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('status').optional().isIn(['pending', 'in_progress', 'done']),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { title, description, status } = req.body;
  const { rows } = await pool.query(
    'INSERT INTO tasks (title, description, status, user_id) VALUES ($1, $2, $3, $4) RETURNING *',
    [title, description || null, status || 'pending', req.user.id]
  );
  res.status(201).json(rows[0]);
});

/**
 * @swagger
 * /api/v1/tasks/{id}:
 *   put:
 *     summary: Update a task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title: { type: string }
 *               description: { type: string }
 *               status: { type: string }
 *     responses:
 *       200: { description: Task updated }
 *       404: { description: Not found }
 */
router.put('/:id', authenticate, [
  body('title').optional().trim().notEmpty(),
  body('status').optional().isIn(['pending', 'in_progress', 'done']),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { rows: existing } = await pool.query('SELECT * FROM tasks WHERE id = $1', [req.params.id]);
  if (!existing[0]) return res.status(404).json({ error: 'Task not found' });
  if (req.user.role !== 'admin' && existing[0].user_id !== req.user.id)
    return res.status(403).json({ error: 'Access denied' });

  const { title, description, status } = req.body;
  const { rows } = await pool.query(
    `UPDATE tasks SET
      title = COALESCE($1, title),
      description = COALESCE($2, description),
      status = COALESCE($3, status)
    WHERE id = $4 RETURNING *`,
    [title, description, status, req.params.id]
  );
  res.json(rows[0]);
});

/**
 * @swagger
 * /api/v1/tasks/{id}:
 *   delete:
 *     summary: Delete a task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Task deleted }
 *       404: { description: Not found }
 */
router.delete('/:id', authenticate, async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM tasks WHERE id = $1', [req.params.id]);
  if (!rows[0]) return res.status(404).json({ error: 'Task not found' });
  if (req.user.role !== 'admin' && rows[0].user_id !== req.user.id)
    return res.status(403).json({ error: 'Access denied' });

  await pool.query('DELETE FROM tasks WHERE id = $1', [req.params.id]);
  res.json({ message: 'Task deleted' });
});

/**
 * @swagger
 * /api/v1/tasks/admin/all:
 *   get:
 *     summary: Admin - get all users list
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200: { description: All users }
 *       403: { description: Access denied }
 */
router.get('/admin/all', authenticate, requireRole('admin'), async (req, res) => {
  const { rows } = await pool.query('SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC');
  res.json(rows);
});

module.exports = router;
