export function parseLesson(lesson) {
  const les = lesson.node;
  return {
    title: les.title.value,
    description: les.description.value,
    duration: les.duration.value,
    video: les.video?.reference,
  };
}

export function parseSection(section) {
  const sec = section.node;
  const less = sec.lessons?.references.edges || [];
  return {
    title: sec.title.value,
    description: sec.description,
    lessons: less ? less.map(parseLesson) : [],
  };
}

export function parseMetaobject(metaobject) {
  console.log(JSON.stringify(metaobject, null, 2));

  const secs = metaobject.sections.references?.edges.map(parseSection) || [];

  return {
    sections: secs,
    title: metaobject.title.value,
    description: metaobject.description.value,
  };
}
