---
name: database-skill
description: Create tables, manage migrations, and design database schemas for full-stack applications.
---

# Database Skill

## Instructions

1. **Schema design**
   - Define tables for your application entities
   - Identify primary and foreign keys
   - Choose appropriate data types for each column
   - Include timestamps (created_at, updated_at) where needed
   - Identify entities and relationships


2. **Table creation**
   - Implement tables using SQL or ORM models
   - Ensure proper relationships (one-to-many, many-to-many)
   - Apply constraints (unique, not null, default values)
   - Index frequently queried columns for performance
   - Define proper data types
   - Use clear and meaningful table names


3. **Migrations**
   - Use migration tools (Alembic, Prisma, Django Migrations, etc.)
   - Version control your schema changes
   - Support rolling forward and rolling back
   - Test migrations in development before production
   - Keep migrations small and focused


4. **Data integrity**
   - Enforce referential integrity with foreign keys
   - Validate data types and value ranges
   - Apply default values and constraints to prevent invalid data
   - Use transactions for multi-step operations

5. **Optimization**
   - Normalize tables to reduce redundancy
   - Denormalize selectively for performance-critical queries
   - Use indexes wisely for query efficiency
   - Monitor and optimize query performance as needed

## Best Practices
- Keep table and column names consistent and descriptive
- Never store sensitive data in plaintext
- Document schema changes in version control
- Plan schema with scalability in mind
- Apply migrations for all schema changes, never manual updates

## Example Structure
```sql
-- Users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tasks table
CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  title VARCHAR(200) NOT NULL,
  description TEXT,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
