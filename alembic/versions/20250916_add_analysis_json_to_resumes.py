"""add analysis_json column to resumes

Revision ID: add_analysis_json_to_resumes
Revises: 
Create Date: 2025-09-16
"""

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'add_analysis_json_to_resumes'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    with op.batch_alter_table('resumes') as batch_op:
        batch_op.add_column(sa.Column('analysis_json', sa.Text(), nullable=True))


def downgrade():
    with op.batch_alter_table('resumes') as batch_op:
        batch_op.drop_column('analysis_json')


