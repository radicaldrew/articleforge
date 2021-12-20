import axios, {Method} from 'axios';
import qs from 'qs';
interface ArticleParams {
  keyword: string;
  sub_keywords?: string;
  length?: string;
  title?: number;
  image?: number;
  video?: number;
  auto_links?: string;
  turing_spinner: number;
  quality: number;
  rewrite_num: number;
}

class ArticleForge {
  private key: string;
  private baseurl: string;
  private methods: Array<string>;
  constructor(key: string) {
    this.key = key;
    this.methods = [
      'check_usage',
      'view_articles',
      'view_article',
      'view_spintax',
      'view_spin',
      'initiate_article',
      'get_api_progress',
      'get_api_article_result',
      'delete_article',
    ];
    this.baseurl = 'https://af.articleforge.com/api/';
  }
  async request(method: string, params: Object) {
    try {
      if (!method) {
        return {error: 'method name required'};
      }
      if (!this.methods.includes(method)) {
        return {error: 'method not found'};
      }
      const response = await axios.post(`${this.baseurl}${method}`, {
        key: this.key,
        ...params,
      });
      return response.data;
    } catch (error) {
      return {error};
    }
  }
  async usage() {
    try {
      return await this.request('check_usage', {});
    } catch (error) {
      return {error};
    }
  }
  async articles() {
    try {
      return await this.request('view_articles', {});
    } catch (error) {
      return {error};
    }
  }
  async article(article_id: string) {
    try {
      if (!article_id) {
        return {error: 'article id is required'};
      }
      return await this.request('view_article', {
        article_id,
      });
    } catch (error) {
      return {error};
    }
  }
  async create_article(params: ArticleParams) {
    try {
      if (!params) {
        return {error: 'params are required'};
      }

      if (!params.keyword) {
        return {error: 'keyword is required'};
      }

      const queryParams = {
        keyword: params.keyword,
        sub_keywords: params.sub_keywords ? params.sub_keywords : '',
        length: params.keyword ? params.keyword : '',
        title: params.title ? params.title : 0,
        image: params.image ? params.image : 0.0,
        video: params.video ? params.video : 0.0,
        auto_links: params.auto_links ? params.auto_links : '',
        turing_spinner: params.turing_spinner ? params.turing_spinner : 0,
        quality: params.quality ? params.quality : 4,
        rewrite_num: params.rewrite_num ? params.rewrite_num : 5,
      };

      const data = qs.stringify(
        (Object.assign({key: this.key}, queryParams),
        {
          encoder: function (str: String) {
            return str.replace(/ /g, '+');
          },
        })
      );

      const method: Method = 'post';

      const config = {
        method,
        url: `${this.baseurl}initiate_article`,
        data,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent':
            'Mozilla/5.0 (platform; rv:geckoversion) Gecko/geckotrail Firefox/firefoxversion',
        },
      };

      return await axios(config);
    } catch (error) {
      return {error};
    }
  }

  async progress(ref_key: string) {
    try {
      if (!ref_key) {
        return {error: 'ref_key is required'};
      }
      return await this.request('get_api_progress', {
        ref_key,
      });
    } catch (error) {
      return {error};
    }
  }
  async result(ref_key: string) {
    try {
      if (!ref_key) {
        return {error: 'ref_key is required'};
      }
      return await this.request('get_api_article_result', {
        ref_key,
      });
    } catch (error) {
      return {error};
    }
  }
  async delete(article_id: string) {
    try {
      if (!article_id) {
        return {error: 'article id is required'};
      }
      return await this.request('delete_article', {
        article_id,
      });
    } catch (error) {
      return {error};
    }
  }
}

module.exports = exports = ArticleForge;
Object.defineProperty(exports, '__esModule', {value: true});
export default ArticleForge;
