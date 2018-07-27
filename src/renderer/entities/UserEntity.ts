import {Entity, Column, PrimaryGeneratedColumn} from 'typeorm';
 
@Entity()
export class UserEntity {
 
    @PrimaryGeneratedColumn()
    id!: number;
 
    @Column()
    name!: string;
    
    constructor(userForm:any = null) {
        if (userForm) {
            this.name = userForm.name;
        }
    }
}