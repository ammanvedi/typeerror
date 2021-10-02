import {useRouter} from "next/router";
import {getContentBySlug, loadContent, PostModel} from "../../util/content";
import {GetStaticPathsResult, GetStaticPropsContext, GetStaticPropsResult} from "next";

type PostProps = {
    post: PostModel
}

const Post = ({post}: PostProps) => {
    const {query} = useRouter()

    return (
        <div>
            {query.slug}
            <pre>
                {JSON.stringify(post, null, 2)}
            </pre>
            <article  >
                <h1>{post.meta.title}</h1>
                <div dangerouslySetInnerHTML={{__html: post.content}} />
            </article>
        </div>
    )
}



export async function getStaticProps(context: GetStaticPropsContext): Promise<GetStaticPropsResult<PostProps>> {
    const {params} = context;
    const {posts} = loadContent();

    
    if (!params?.slug || typeof params.slug !== 'string') {
        return {
            notFound: true
        }
    }

    const [post] = getContentBySlug<PostModel>(params.slug, posts)

    if(!post) {
        return {
            notFound: true
        }
    }

    return {
        props: {
            post: post || null
        }
    }
}

export async function getStaticPaths(): Promise<GetStaticPathsResult> {
    const {posts} = loadContent();

    return {
        paths: posts.map(post => ({
            params: {slug: post.meta.slug}
        })),
        fallback: false
    }
}


export default Post;