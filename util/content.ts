import matter from 'gray-matter'
import marked from 'marked'
import path from 'path'
import fs from 'fs'

export type GlobalMetadataModel = {
    title: string,
    slug: string,
}

export type GlobalContentModel<T extends GlobalMetadataModel, CT extends ContentType> = {
    type: CT
    meta: T
    link: string,
    content: string
}

enum ContentType {
    POST,
    WORK
}

export type PostMetaData = {
    publishedUTCISOTimestamp: string,
} & GlobalMetadataModel

export type PostModel = GlobalContentModel<PostMetaData, ContentType.POST>

export type WorkMetaData = {
    company: string,
    workPeriod: string,
    public: boolean,
} & GlobalMetadataModel

export type WorkModel = GlobalContentModel<WorkMetaData, ContentType.WORK>

export type GrayMatter<T> = Omit<matter.GrayMatterFile<string>, 'data'> & {
    data: T
}

export type RawContent<MetaType> = {
    meta: GrayMatter<MetaType>,
    parsedContent: string
}

export type ContentModel = PostModel | WorkModel;

const DirContentBase = path.join(process.cwd(), 'content')
export const DirWork = path.join(DirContentBase, 'work')
export const DirPosts = path.join(DirContentBase, 'posts')

export const getContentBySlug =
    <T extends GlobalContentModel<any, any>>
    (slug: string, content: Array<T>): Array<T> => {
    return content.filter(c => c.meta.slug === slug)
}

export const getPostContent = (dir: string = DirPosts): Array<PostModel> => {
    const rawContent = getRawContent<PostMetaData>(dir);

    return rawContent.map(content => ({
        type: ContentType.POST,
        meta: content.meta.data,
        content: content.parsedContent,
        link: `/posts/${content.meta.data.slug}`,
    }))
}

export const getWorkContent = (dir: string = DirWork): Array<WorkModel> => {
    const rawContent = getRawContent<WorkMetaData>(dir);

    return rawContent.map(content => ({
        type: ContentType.WORK,
        meta: content.meta.data,
        content: content.parsedContent,
        link: `/work/${content.meta.data.slug}`,
    }))
}


const getRawContent = <MetaType>(dir: string): Array<RawContent<MetaType>> => {
    const files = fs.readdirSync(dir);

    return files.reduce<Array<RawContent<MetaType>>>((acc, fileName) => {


        try {
            const filePath = path.join(dir, fileName);
            const fileContent = fs.readFileSync(filePath);

            const meta = matter<string, {}>(fileContent.toString('utf-8')) as GrayMatter<MetaType>;
            const parsedContent = marked(meta.content)

            return [...acc, {
                meta,
                parsedContent
            }]

        } catch (e) {
            console.log('Failed to generate posts :(');
            console.log('\t', 'dir ::', dir);
            console.log('\t', 'file name ::', fileName);
            console.log('\t', 'error ::', e);
            console.log('\n');
            return acc;
        }

    }, [])
}

export const loadContent = (function () {

    let data: {
        work: Array<WorkModel>,
        posts: Array<PostModel>
    } | null = null


    return function () {

        if(data === null) {
            data = {
                work: getWorkContent(),
                posts: getPostContent()
            }
        }

        return data
    }
})()