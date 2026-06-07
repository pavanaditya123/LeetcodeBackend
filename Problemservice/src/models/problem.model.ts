import mongoose from 'mongoose';

export interface ItestCase {
    input:string;
    output:string;
}

export interface IProblem extends mongoose.Document{
    title:string;
    description:string;
    difficulty:"Easy" | "Medium" | "Hard";
    createdAt:Date;
    updatedAt:Date;
    editorial?:string;
    testCases:ItestCase[]; 
}

const testSchema = new mongoose.Schema<ItestCase>({
    input:{
        type:String,
        required:[true,"INPUT is required"]
    },
    output:{
        type:String,
        required:[true,"OUTPUT is required"]
    }
},
    {
        //_id:false this s onyl required if we dont want to genete an unique id for a tescase 
    }
)

const problemSchema = new mongoose.Schema<IProblem>({
    title:{
        type:String,
        required:[true,"Title is required"],
        maxlength:[100,"title cannot be more than 100 characters"],
        trim:true,
        unique:true
    },
    description:{
        type:String,
        required:[true,"Description is required"],
        trim:true,
    },
    difficulty:{
        type:String,
        enum:{
            values:["Easy","Medium","Hard"],
            message:"invalid difficulty value",
        },
        default:"Easy",
        required:[true,"Difficulty is required"]
    },
    editorial:{
        type:String,
        trim:true,
    },
    testCases:{
        type:[testSchema],
        validate:{
            validator:function(value:ItestCase[]){
                return value.length>0;
            },
            message:"At least one test case is required"        
        }
    }
},
    {
        timestamps:true
    }
)


problemSchema.index({title:1});
problemSchema.index({difficulty:1})
//this is bascially a comound index which will help us to fetch the problems based on difficulty and also sort them based on createdat  sso that if i get the  newer question wiht easy or medium or hard....
problemSchema.index({
    difficulty: 1,
    createdAt: -1
}); 

export const Problem=mongoose.model<IProblem>('Problem',problemSchema);
