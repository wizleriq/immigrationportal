import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity({ name: "users" }) 
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  // @Column()
  // name!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password_hash!: string;

  @Column()
  user_type!: string;

  @Column({ default: true })
  is_active!: boolean;

  @CreateDateColumn()
  created_at!: Date;

  @Column({ default: false })
  is_verified!: boolean;

  @Column({ nullable: true})
  verification_token!: string;

  @Column({ nullable: true})
  verification_token_expires_at!: Date;
}






// import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

// @Entity({ name: "users" }) 
// export class User {
//   @PrimaryGeneratedColumn("uuid")
//   id!: string;

//   // @Column()
//   // name!: string;

//   @Column({ unique: true })
//   email!: string;

//   @Column()
//   password_hash!: string;

//   @Column()
//   user_type!: string;

//   @Column({ default: true })
//   is_active!: boolean;

//   @CreateDateColumn()
//   created_at!: Date;
// }