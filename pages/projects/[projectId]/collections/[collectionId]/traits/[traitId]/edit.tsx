import Header from "../../../../../../../components/Header";
import Layout from "../../../../../../../components/Layout";
import FormDescription from "../../../../../../../components/FormDescription";
import Project, { Projects } from "../../../../../../../models/project";
import Collection, {
  Collections,
} from "../../../../../../../models/collection";
import Trait, { Traits } from "../../../../../../../models/trait";
import { GetServerSideProps } from "next";
import { FormEvent, useState } from "react";
import { useRouter } from "next/router";

interface Props {
  project: Project;
  projects: Project[];
  collection: Collection;
  trait: Trait;
  projectId: string;
}

export default function EditPage(props: Props) {
  const project = props.project;
  const projects = props.projects;
  const collection = props.collection;
  const trait = props.trait;
  const projectId = props.projectId;

  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();
  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const data = new FormData(event.target as HTMLFormElement);

    setIsSubmitting(true);

    const name = data.get("name")?.toString().trim();

    const zIndexStr = data.get("zIndex")?.toString().trim();
    const zIndex = zIndexStr ? parseInt(zIndexStr) : null;

    await Traits.update(
      {
        name: name,
        zIndex: zIndex ?? 0,
      },
      trait.id,
      projectId,
      collection.id
    );

    setIsSubmitting(false);

    router.push(
      {
        pathname:
          "/projects/" +
          projectId +
          "/collections/" +
          collection.id +
          "/traits",
        query: {},
      },
      undefined,
      { shallow: false }
    );
  };

  return (
    <Layout
      title="Edit Traits"
      section="collections"
      projects={projects}
      selectedProjectId={projectId}
    >
      <Header title="Edit Trait" />
      <main className="px-8 py-12">
        <div>
          <div className="md:grid md:grid-cols-3 md:gap-6">
            <FormDescription
              title="Trait"
              description="Enter details about your trait."
            />
            <div className="mt-5 md:mt-0 md:col-span-2">
              <form action="#" method="POST" onSubmit={onSubmit}>
                <div className="shadow sm:rounded-md sm:overflow-hidden">
                  <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        defaultValue={trait.name}
                        placeholder="Background Color"
                        className="mt-1 block w-full shadow-sm sm:text-sm rounded-md"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="zIndex"
                        className="block text-sm font-medium"
                      >
                        Layer (z-index)
                      </label>
                      <input
                        type="text"
                        name="zIndex"
                        id="zIndex"
                        placeholder="0"
                        defaultValue={trait.zIndex}
                        className="mt-1 block w-full shadow-sm sm:text-sm rounded-md border-transparent"
                      />
                    </div>
                  </div>

                  <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                    <button
                      type="submit"
                      className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const projectId = context.query.projectId?.toString();
    const collectionId = context.query.collectionId?.toString();
    const traitId = context.query.traitId?.toString();

    if (projectId && collectionId && traitId) {
      const projects = await Projects.all();
      const collection = await Collections.withId(collectionId, projectId);
      const trait = await Traits.withId(projectId, collectionId, traitId);
      const project = projects.find((project) => project.id == projectId);

      return {
        props: {
          project: project,
          projects: projects,
          collection: collection,
          trait: trait,
          projectId: projectId,
        },
      };
    }
  } catch (error) {
    console.log("Error: ", error);
  }

  return {
    props: {},
  };
};
