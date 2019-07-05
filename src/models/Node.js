class NodeModel {
  constructor(json) {
    if (!json) {
      return {};
    }

    this.id = json.id;
  }
}

export default NodeModel;
