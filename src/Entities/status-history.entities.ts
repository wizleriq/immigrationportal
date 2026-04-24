import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToMany } from "typeorm";
import { PaymentTransaction } from "./payment-transaction.entities";
import { User } from "./user.entities";

@Entity({ name: "status_history" })
export class StatusHistory {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @ManyToMany(() => PaymentTransaction, (tx) => tx.status_history)
    transaction!: PaymentTransaction;

    // @ManyToMany(() => PaymentTransaction)
    // transaction!: PaymentTransaction;

    @Column()
    old_status!: string;

    @Column()
    new_status!: string;

    @ManyToMany(() => User)
    changed_by!: User;      

    @CreateDateColumn()
    changed_at!: Date;

    @Column({ nullable: true })
    remark!: string;
}