"""Planter change 2

Revision ID: 87c1d1b85aee
Revises: d1309a225483
Create Date: 2023-08-22 22:26:47.867948

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '87c1d1b85aee'
down_revision: Union[str, None] = 'd1309a225483'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_index('ix_planters_id', table_name='planters')
    op.drop_table('planters')
    op.drop_index('ix_farm_houses_id', table_name='farm_houses')
    op.drop_index('ix_farm_houses_name', table_name='farm_houses')
    op.drop_index('ix_farm_houses_nursery_number', table_name='farm_houses')
    op.drop_table('farm_houses')
    op.drop_index('ix_users_id', table_name='users')
    op.drop_index('ix_users_login_id', table_name='users')
    op.drop_table('users')
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('users',
    sa.Column('id', sa.INTEGER(), server_default=sa.text("nextval('users_id_seq'::regclass)"), autoincrement=True, nullable=False),
    sa.Column('login_id', sa.VARCHAR(length=20), autoincrement=False, nullable=True),
    sa.Column('password', sa.VARCHAR(), autoincrement=False, nullable=True),
    sa.Column('code', sa.VARCHAR(length=2), autoincrement=False, nullable=True),
    sa.PrimaryKeyConstraint('id', name='users_pkey'),
    postgresql_ignore_search_path=False
    )
    op.create_index('ix_users_login_id', 'users', ['login_id'], unique=False)
    op.create_index('ix_users_id', 'users', ['id'], unique=False)
    op.create_table('farm_houses',
    sa.Column('id', sa.INTEGER(), server_default=sa.text("nextval('farm_houses_id_seq'::regclass)"), autoincrement=True, nullable=False),
    sa.Column('name', sa.VARCHAR(length=255), autoincrement=False, nullable=True),
    sa.Column('nursery_number', sa.VARCHAR(length=244), autoincrement=False, nullable=True),
    sa.Column('address', sa.TEXT(), autoincrement=False, nullable=True),
    sa.Column('owner_id', sa.INTEGER(), autoincrement=False, nullable=True),
    sa.Column('phone', sa.VARCHAR(length=20), autoincrement=False, nullable=True),
    sa.ForeignKeyConstraint(['owner_id'], ['users.id'], name='farm_houses_owner_id_fkey'),
    sa.PrimaryKeyConstraint('id', name='farm_houses_pkey'),
    postgresql_ignore_search_path=False
    )
    op.create_index('ix_farm_houses_nursery_number', 'farm_houses', ['nursery_number'], unique=False)
    op.create_index('ix_farm_houses_name', 'farm_houses', ['name'], unique=False)
    op.create_index('ix_farm_houses_id', 'farm_houses', ['id'], unique=False)
    op.create_table('planters',
    sa.Column('farm_house', sa.INTEGER(), autoincrement=False, nullable=True),
    sa.Column('id', sa.INTEGER(), autoincrement=True, nullable=False),
    sa.Column('serial_number', sa.VARCHAR(length=255), autoincrement=False, nullable=True),
    sa.Column('is_register', sa.BOOLEAN(), autoincrement=False, nullable=True),
    sa.Column('register_date', postgresql.TIMESTAMP(), autoincrement=False, nullable=True),
    sa.ForeignKeyConstraint(['farm_house'], ['farm_houses.id'], name='planters_farm_house_fkey'),
    sa.PrimaryKeyConstraint('id', name='planters_pkey')
    )
    op.create_index('ix_planters_id', 'planters', ['id'], unique=False)
    # ### end Alembic commands ###
