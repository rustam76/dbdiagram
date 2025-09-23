import type { ProjectModel as ProjectModel } from '$lib/dbml';
import { sql, type InferInsertModel, type InferSelectModel } from 'drizzle-orm';
import { pgTable, text, timestamp, boolean, jsonb } from 'drizzle-orm/pg-core';

type MemberMeta = {
	name: string;
	image: string;
};
export const member = pgTable('member', {
	id: text('id').primaryKey(),
	email: text('email').notNull(),
	meta: jsonb('meta').$type<MemberMeta>().notNull(),
	createdAt: timestamp('created_at')
		.notNull()
		.defaultNow(),
	updatedAt: timestamp('updated_at')
		.notNull()
		.defaultNow()
});

export type Member = InferSelectModel<typeof member>;
export type CreateMember = InferInsertModel<typeof member>;

type PublicPermission = {
	canView?: boolean;
	canEdit?: boolean;
};
type ProjectMeta = PublicPermission;
export const project = pgTable('project', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	meta: jsonb('meta').$type<ProjectMeta>().notNull(),
	isDeleted: boolean('is_deleted').notNull(),
	createdAt: timestamp('created_at')
		.notNull()
		.defaultNow(),
	updatedAt: timestamp('updated_at')
		.notNull()
		.defaultNow()
});

export type CreateProject = InferInsertModel<typeof project>;
export type Project = InferSelectModel<typeof project>;
type Permission = {
	isOwner?: boolean;
	canEdit?: boolean;
	canInvite?: boolean;
	canView?: boolean;
};

export const projectMember = pgTable('project_member', {
	id: text('id').primaryKey(),
	memberId: text('member_id').references(() => member.id),
	projectId: text('project_id').references(() => project.id),
	permission: jsonb('permission').$type<Permission>().notNull()
});

export type ProjectMember = InferSelectModel<typeof projectMember>;
export type CreateProjectMember = InferInsertModel<typeof projectMember>;

export const resource = pgTable('resource', {
	id: text('id').primaryKey(),
	projectId: text('project_id').references(() => project.id),
	code: text('code').notNull(),
	model: jsonb('model').$type<ProjectModel>().notNull()
});

export type Resource = InferSelectModel<typeof resource>;
export type CreateResource = InferInsertModel<typeof resource>;
