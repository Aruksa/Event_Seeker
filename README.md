# EventSeeker: The Ultimate Event Management Platform

EventSeeker allows users to create, manage, and explore a wide array of events with robust search and rating capabilities.

## Features

- **Event Management**  
  Users can post their unique events with titles, start and end dates, descriptions, and categories.

  - Users can perform full CRUD operations on events they’ve created.
  - Events include scoring details with a breakdown into categories: **Interested**, **Going**, and **Not Going**.

- **Comprehensive Search and Filter**

  - **General Event Search**: Users can search all available events using keywords, start and end dates, and categories.
  - **User-Specific Event Search**: Users can filter their own events for easy management.
  - Events can be sorted based on scores and other parameters for a personalized experience.

- **Event Ratings and Reviews**  
  Each event page displays ratings and individual reviews, allowing users to give feedback and see event popularity.

- **Optimized Search and Infinite Scroll**

  - **Elasticsearch Integration**: Built on a distributed database with Elasticsearch and PostgreSQL for scalable and efficient search capabilities, handling over 1 million indexed events.
  - **Infinite Scroll**: Provides a seamless user experience by loading events gradually as users scroll.
  - **Debouncer**: Minimizes requests to the server, enhancing performance and reducing load.

- **Scalable Database and Indexing**

  - PostgreSQL generates unique IDs for events, which are then indexed in Elasticsearch for rapid search and retrieval.
  - **Data-Intensive Setup**: A preloaded dataset of 1 million events demonstrates the system's capability to handle extensive data loads.

- **Authentication and Interface**
  - Secure authentication handled with JWT tokens.
  - User interface styled with Chakra UI components for a clean and responsive design.

## Future Enhancements

- **WebSocket Integration**  
  Potential to enhance real-time user experience by introducing WebSocket-based interactions to improve event posting speed, addressing the write speed limitations of Elasticsearch.

- **Alternative Search and Analytics Solutions**  
  While Elasticsearch (based on Apache Lucene) is effective, exploring other distributed databases or search and analytics engines could further improve performance. Solutions with optimized sharding mechanisms may offer advantages in managing large-scale data and reducing latency.

- **Improved Indexing Strategy**  
  Instead of using standard primary keys for indexing, UUIDs, GUIDs, or timestamp-based IDs could be employed to prevent potential hotspots and ensure smoother, more efficient data distribution across shards.

## Performance Comparison

Here’s a comparison of the response speeds of the get operation with and without Elasticsearch:

![The speed of my get operation without Elasticsearch](./assets/normal_get.PNG)
_The speed of my get operation without Elasticsearch_

![The speed of my get operation with Elasticsearch](./assets/elastic_get2.PNG)
_The speed of my get operation with Elasticsearch_

EventSeeker is designed to provide an efficient, engaging experience for users managing and attending events, with further improvements on the way.
