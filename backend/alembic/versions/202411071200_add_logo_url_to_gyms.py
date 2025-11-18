"""Add logo_url column to gyms"""

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = "202411071200"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column("gyms", sa.Column("logo_url", sa.String(), nullable=True))


def downgrade() -> None:
    op.drop_column("gyms", "logo_url")
