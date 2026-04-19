import { Entity, PrimaryGeneratedColumn, ManyToOne, Column,  CreateDateColumn, UpdateDateColumn } from "typeorm";
import { StudentProfile } from "./student-profile.entities";
import { Beneficiary } from "./beneficiary.entities";
import { Agent } from "node:http";

@Entity ({ name: "payment-transactions" })
export class PaymentTransaction {
    @PrimaryGeneratedColumn("uuid")
    transaction_id!: string;

    @Column()
    transaction_reference!: string;

    @ManyToOne(() => StudentProfile)
    student_profile!: StudentProfile;

    @ManyToOne(() => Agent)
    agent!: Agent;

    @ManyToOne(() => Beneficiary)
    beneficiary!: Beneficiary;

    @Column({ nullable: true })
    rate_quote_id!: string

    @Column()
    payment_type!: string;

    @Column({ nullable: true })
    student_number_at_beneficiary!: string;

    @Column("decimal", { precision: 10, scale: 2 })
    cad_amount!: number;

    @Column()
    local_currency!: string;

    @Column("decimal", { precision: 10, scale: 2 })
    local_amount!: number;

    @Column("decimal", { default: 0 })
    service_fee_amount!: number;

    @Column("decimal", { default: 0 })
    total_payable_local!: number;

    @Column({ type: "timestamp", nullable: true })
    rate_locked_at!: Date;

    @Column({ type: "timestamp", nullable: true })
    rate_expires_at!: Date;

    @Column({ default: "pending" })
    status!: string;

    @Column({ type: "timestamp", nullable: true })
    local_transfer_due_at!: Date;

    @Column({ default: false })
    beneficiary_confirmation_flag!: boolean;

    @Column({ type: "timestamp", nullable: true })
    beneficiary_confirmation_at!: Date;

   @Column({ nullable: true })
   admin_confirmed_by!: string;

   @Column({ type: "timestamp", nullable: true })
   admin_confirmed_at!: Date;

   @CreateDateColumn()
   created_at!: Date;

   @UpdateDateColumn()
   updated_at!: Date;
}
