import { Agent } from 'egg';
export default class Boot  {
  agent: Agent;

  constructor(agent: Agent) {
    this.agent = agent;
  }


}
