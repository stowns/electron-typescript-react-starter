import {Entity, Column, PrimaryGeneratedColumn} from 'typeorm';
 
@Entity()
export class UserEntity {
 
    @PrimaryGeneratedColumn()
    id!: number;
 
    @Column()
    name!: string;

}