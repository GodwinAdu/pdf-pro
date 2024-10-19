"use server"

import File from "../models/file.models";
import GroupConversation from "../models/group-conversation.models";
import Message from "../models/message.models";
import { connectToDB } from "../mongoose"
import { getPineconeClient } from "../pinecone";

interface createFileProps {
    key: string;
    name: string;
    userId: string;
    url: string;
    uploadStatus: string;
}

export async function createFile(data: createFileProps) {
    try {
    await connectToDB();

    const { key, name, userId, url, uploadStatus } = data

        const existingFile = await File.findOne({ key });

        if (existingFile) {
            throw new Error("File already exist is DB");
        }

        const file = new File({
            key,
            name,
            userId,
            url,
            uploadStatus
        })

        await file.save();

    } catch (error: any) {
        console.log("Unable to create file to DB", error)
        return;
    }
}


interface Props {
    userId: string,
}
export async function fetchUserFiles({ userId }: Props) {
    await connectToDB();

    try {
        console.log(userId)
        const files = await File.find({ userId })
        if (!files) {
            console.log("no files exist ");
            throw new Error("No files found")
        }

        return JSON.parse(JSON.stringify(files))

    } catch (error: any) {
        console.error("Error fetching files from the database:", error);
        throw new Error("Unable to fetch user files from the database");
    }
}

interface FetchFileKeyProps {
    key: string;
    userId: string
}

export async function fetchFileByKey({ key, userId }: FetchFileKeyProps) {
    try {
    await connectToDB();
        const file = await File.findOne({ key, userId })
        if (!file) {
            throw new Error("File doesnt exist")
        }
        return JSON.parse(JSON.stringify(file));
    } catch (error: any) {
        console.log("cannot fetch file by key", error)
    }
}

interface FetchFileIdProps {
    id: string;
    userId: string
}

export async function fetchFileById({ id, userId }: FetchFileIdProps) {
    await connectToDB();
    try {
        const file = await File.findOne({ _id: id, userId });

        if (!file) {
            return { status: "PENDING" as const }
        };

        return JSON.parse(JSON.stringify(file))


    } catch (error: any) {
        console.log("cannot fetch file by key", error)
    }
}

interface fetchPdfProps {
    id: string;
    userId: string
}

export async function fetchPDF({ id, userId }: fetchPdfProps) {
    await connectToDB();
    try {
        console.log(id, userId)
        const getFile = await File.findOne({
            _id: id,
            userId
        });

        if (!getFile) {
            throw new Error("File not found or not authorized.");
        }

        return JSON.parse(JSON.stringify(getFile));

    } catch (error: any) {
        console.log("Couldnt fetch file from DB", error);
        throw error;
    }
}

interface CurrentProps {
    key: string
}
export async function fetchCurrentPDF({ key }: CurrentProps) {
    await connectToDB();
    try {

        const getFile = await File.findOne({ key });

        if (!getFile) {
            throw new Error("File not found or not authorized.");
        }

        return JSON.parse(JSON.stringify(getFile));

    } catch (error: any) {
        console.log("Couldnt fetch file from DB", error);
        throw error;
    }
}



interface deleteFileProps {
    id: string;
    userId: string
}

export async function deleteFile({ userId, id }: deleteFileProps) {
    await connectToDB();

    try {

        // Find the file by both id and userId and delete it.
        const deletedFile = await File.findOneAndDelete({ _id: id, userId });

        if (!deletedFile) {
            throw new Error("File not found or not authorized for deletion.");
        }

        // Delete data from pinecode vector database with delete file id
        const pc = await getPineconeClient();
        const pinecone = pc.index("summaq");
        await pinecone.namespace(id).deleteAll();


        //Delete all message with delete file id
        await Message.deleteMany({ fileId: id })

        return JSON.parse(JSON.stringify(deletedFile)); // Return the deleted file or a success message.

    } catch (error: any) {
        console.error("Error while deleting the file:", error);
        throw error; // Rethrow the error or handle it as needed.
    }
}


interface statusProps {
    fileId: string;
    newStatus: string
}
export async function updateUploadStatus({ fileId, newStatus }: statusProps) {
    await connectToDB();

    try {
        const updatedFile = await File.findByIdAndUpdate(
            fileId,
            { uploadStatus: newStatus },
            { new: true }
        );

        if (!updatedFile) {
            throw new Error('File not found');
        }

        return JSON.parse(JSON.stringify(updatedFile));
    } catch (error) {
        throw error;
    }
};


// for group discussion???

export async function getOrCreateConversation (memberOneId: string, memberTwoId: string){
  let conversation = await findConversation(memberOneId, memberTwoId)
    || await findConversation(memberTwoId, memberOneId);

  if (!conversation) {
    conversation = await createNewConversation(memberOneId, memberTwoId);
  }

  return JSON.parse(JSON.stringify(conversation));
}

export async function findConversation(memberOneId: string, memberTwoId: string){
  try {
    await connectToDB();

    return await GroupConversation.findOne({
      $and: [
        { memberOne: memberOneId },
        { memberTwo: memberTwoId },
      ],
    })
    .populate({
      path: 'memberOne',
      populate: {
        path: 'userId',  // Assuming memberOne has a reference to user profile (userId)
        model: 'User',   // Assuming User is the profile model
      },
    })
    .populate({
      path: 'memberTwo',
      populate: {
        path: 'userId',  // Assuming memberTwo has a reference to user profile (userId)
        model: 'User',
      },
    })

  } catch (error) {
    console.error("Error finding conversation:", error);
    return null;
  }
}

export async function createNewConversation(memberOneId: string, memberTwoId: string){
  try {
    await connectToDB()
    return await GroupConversation.create({
      memberOne: memberOneId,
      memberTwo: memberTwoId,
    }).then(conversation =>
      conversation
        .populate({
          path: 'memberOne',
          populate: {
            path: 'userId',
            model: 'User',
          },
        })
        .populate({
          path: 'memberTwo',
          populate: {
            path: 'userId',
            model: 'User',
          },
        })
    );
  } catch (error) {
    console.error("Error creating conversation:", error);
    return null;
  }
}
