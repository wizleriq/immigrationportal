import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { StudentProfile } from "./student-profile.entities";
import { Beneficiary } from "./beneficiary.entities";
import { Agent } from "./agent.entities";

@Entity({ name: "kyc_documents" })
export class KYCDocument {
    @PrimaryGeneratedColumn("uuid")
    document_id!: string;

    @ManyToOne(() => StudentProfile)
    student!: StudentProfile;

    @Column()
    document_type!: string;

    @Column()
    file_path!: string;

    @Column()
    file_name!: string;

    @Column()
    mime_type!: string;

    @CreateDateColumn()
    uploaded_at!: Date;

    @Column({ default: false })
    verified_flag!: boolean;

    @ManyToOne(() => Agent, { nullable: true })
    verified_by!: Agent;

    @Column({ type: "timestamp", nullable: true })
    verified_at!: Date;
}
